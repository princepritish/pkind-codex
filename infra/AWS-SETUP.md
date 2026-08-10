# Deploying pkindustries.net to S3 + CloudFront

One-time setup. After this, every push to `main` publishes automatically via
`.github/workflows/deploy.yml`.

**Read this first:** `.htaccess` does nothing on S3. It is Apache configuration
and S3/CloudFront ignore it silently — no error, the rules just stop existing.
Everything it did is reproduced below. If you skip these steps you lose the
canonical redirects, and the duplicate-content problem comes back invisibly.

---

## 1. S3 bucket

Create a bucket named `pkindustries.net` in `ap-south-1` (Mumbai — closest to
your customers).

- **Block all public access: leave ON.** CloudFront reaches the bucket through
  Origin Access Control, so the bucket itself never needs to be public.
- Do **not** enable "Static website hosting". We use the REST endpoint plus a
  CloudFront Function, which supports HTTPS properly.

## 2. CloudFront distribution

Create a distribution with the bucket as origin.

| Setting | Value |
|---|---|
| Origin access | Origin Access Control (create new), then apply the generated bucket policy |
| Viewer protocol policy | **Redirect HTTP to HTTPS** ← replaces the `.htaccess` HTTPS rule |
| Allowed methods | GET, HEAD |
| Compress objects automatically | **Yes** ← replaces mod_brotli / mod_deflate |
| Default root object | `index.html` |
| Alternate domain names (CNAMEs) | `pkindustries.net`, `www.pkindustries.net` |
| Custom SSL certificate | Request one in ACM — **must be in `us-east-1`**, CloudFront only reads certs from that region |

### Custom error response

Add one, so 404s serve the styled page instead of S3's XML error:

- HTTP error code `403` → response page `/404.html`, response code `404`
- HTTP error code `404` → response page `/404.html`, response code `404`

(403 is included because the S3 REST origin returns 403, not 404, for keys that
do not exist when public access is blocked.)

### Response headers policy

Create one and attach it to the default behaviour. This replaces the
`.htaccess` security headers:

| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| X-Frame-Options | `SAMEORIGIN` |
| Permissions-Policy | `geolocation=(), microphone=(), camera=()` |

### CloudFront Function

Create a function from `infra/cloudfront-function.js`, publish it, and
associate it with the default behaviour on **Viewer request**. It handles the
www redirect and `/index.html` → `/`.

## 3. Route 53 (or your DNS provider)

- `pkindustries.net` → A record, alias to the CloudFront distribution
- `www.pkindustries.net` → A record, alias to the same distribution
  (the CloudFront Function 301s it to the bare domain)

## 4. IAM role for GitHub OIDC

This lets Actions deploy without storing AWS keys in the repo.

**Identity provider** (only if you have not added it before):
IAM → Identity providers → Add provider → OpenID Connect
- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

**Role** — trust policy, restricted to this repo so no other repository can
assume it:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike": { "token.actions.githubusercontent.com:sub": "repo:princepritish/pkind-codex:ref:refs/heads/main" }
    }
  }]
}
```

**Permissions policy** attached to that role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::pkindustries.net"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::pkindustries.net/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```

## 5. GitHub repository secrets

Settings → Secrets and variables → Actions:

| Secret | Value |
|---|---|
| `AWS_ROLE_ARN` | `arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME>` |
| `CLOUDFRONT_DISTRIBUTION_ID` | e.g. `E1A2B3C4D5E6F7` |

## 6. First deploy

Run the workflow manually (Actions → Deploy to S3 → Run workflow) before
pointing DNS at it. Check the CloudFront domain
(`dxxxxxxxxxxxxx.cloudfront.net`) and confirm:

- [ ] Homepage renders with CSS and images
- [ ] `/casting-powder.html` renders
- [ ] `/index.html` 301s to `/`
- [ ] A nonsense URL serves the styled 404
- [ ] `/robots.txt`, `/llms.txt`, `/sitemap.xml` return correct content types
- [ ] `curl -I` shows the security headers

Only cut DNS once all of those pass.

---

## Migration warning

pkindustries.net is on Apache today and is indexed. Changing hosts carries real
SEO risk if redirects break. Verify the checklist above on the CloudFront
domain **before** moving DNS, and keep the old host running for a few days
afterwards in case you need to roll back.

After the cutover, in Search Console: re-submit `sitemap.xml` and use the URL
Inspection tool on the homepage and one product page to confirm Google fetches
them cleanly.

## Cost

For a site this size, expect **well under $1/month** — S3 storage is ~1.4 MB,
and CloudFront's free tier covers 1 TB egress and 10 million requests. The
main cost risk is invalidations: 1,000/month are free, and this workflow uses
one per deploy.
