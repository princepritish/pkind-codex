/**
 * CloudFront Function - viewer request
 *
 * Replaces the redirect rules that .htaccess used to provide, because
 * S3 and CloudFront do not read .htaccess at all.
 *
 * Handles:
 *   1. www.pkindustries.net  -> pkindustries.net        (301)
 *   2. /index.html           -> /                        (301)
 *   3. /path/                -> /path/index.html         (internal rewrite)
 *
 * HTTP -> HTTPS is NOT handled here; set the distribution's viewer
 * protocol policy to "Redirect HTTP to HTTPS" instead.
 *
 * Deploy: CloudFront > Functions > create, paste this, Publish,
 * then associate with the default behaviour on "Viewer request".
 */
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value : '';

  // 1. Strip the www subdomain
  if (host.indexOf('www.') === 0) {
    var bare = host.substring(4);
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: 'https://' + bare + uri }
      }
    };
  }

  // 2. Collapse an explicit /index.html to the directory form
  if (uri === '/index.html') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: '/' } }
    };
  }
  if (uri.endsWith('/index.html')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: uri.substring(0, uri.length - 'index.html'.length) }
      }
    };
  }

  // 3. Directory requests need an explicit object key for the S3 REST origin
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  }

  return request;
}
