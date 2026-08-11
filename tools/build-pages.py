#!/usr/bin/env python3
"""
Build the standalone pages that have no product grid of their own:
contact, about, exports and privacy.

The nav and footer are lifted from index.html at build time, the same trick
build-blog.py uses. The audit found nav and footer already drifting between
hand-maintained pages; generating these means they cannot drift at all.

Content lives in PAGES below. Everything stated in it is already published
elsewhere on the site - this script does not introduce new claims about the
business.

Usage:  python3 tools/build-pages.py
"""
import os
import re

SITE = "https://pkindustries.net"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as fh:
        return fh.read()


def chrome():
    """Nav and footer from index.html. Same-directory pages, so no path rewriting."""
    src = read("index.html")
    nav = re.search(r'(<nav class="nav shell".*?</nav>)', src, re.S).group(1)
    footer = re.search(r'(<footer class="site-footer.*?</footer>)', src, re.S).group(1)
    tail = re.search(r"(</footer>)(.*?)(</body>)", src, re.S).group(2)
    return nav, footer, tail


CONTACT_BODY = """
      <div class="content-grid">
        <article class="panel">
          <h2>Plant and office</h2>
          <p class="contact-line">
            PK INDUSTRIES<br>
            C 10, Near Industrial Estate, Adityapur<br>
            Jamshedpur, Jharkhand 832109<br>
            India
          </p>
          <h3>Hours</h3>
          <p>Monday to Saturday, 8:00 to 20:00 IST. Closed Sunday.</p>
        </article>

        <article class="panel">
          <h2>Reach us</h2>
          <ul class="doc-list">
            <li><strong>Phone</strong><br><a href="tel:+919431342715">+91 94313 42715</a></li>
            <li><strong>WhatsApp</strong><br><a href="https://wa.me/919431342715" target="_blank" rel="noopener">Message +91 94313 42715</a></li>
            <li><strong>Email</strong><br><a href="mailto:info@pkindustries.net">info@pkindustries.net</a></li>
          </ul>
          <p>WhatsApp is usually the fastest route for a technical question, because photographs of the problem can be attached directly.</p>
        </article>

        <article class="panel">
          <h2>What to include in an enquiry</h2>
          <p>An enquiry with these details can be answered with a grade recommendation instead of a follow-up question:</p>
          <ul class="doc-list">
            <li>Product, or the problem you are trying to solve</li>
            <li>Steel grades being cast or treated</li>
            <li>Heat size and casting route</li>
            <li>Section size and casting speed, for casting powder</li>
            <li>Ladle size and gate type, for nozzle filling compound</li>
            <li>Current consumption and what is going wrong with it</li>
            <li>Trial quantity or monthly requirement</li>
          </ul>
        </article>
      </div>

      <section class="section" style="padding-top:2.4rem">
        <div class="section-heading">
          <p class="eyebrow">Enquiry</p>
          <h2>Send your requirement</h2>
          <p class="lead">Share your casting setup and the issue you are seeing, and we will come back with a practical trial grade rather than a catalogue.</p>
        </div>
        <p><a class="btn btn-primary" href="/#contact">Open the enquiry form</a>
           <a class="btn btn-ghost" href="chatbot.html">Guided enquiry</a></p>
      </section>
"""

ABOUT_BODY = """
      <div class="content-grid">
        <article class="panel">
          <h2>What we make</h2>
          <p>PK INDUSTRIES manufactures consumables for steel melting shops and continuous casting machines: casting powder, nozzle filling compound, refractory castable, mortar, and ladle covering compound.</p>
          <p>These are working consumables rather than capital equipment. They are judged on how a shop runs with them over months, which is why our technical material is written as procedures rather than brochures.</p>
        </article>

        <article class="panel">
          <h2>Where we are</h2>
          <p>The plant is at Adityapur, inside the industrial belt around Jamshedpur in Jharkhand. That position matters commercially: a large share of eastern India's steel melting capacity sits within a short dispatch radius, so trial quantities and repeat supply can move quickly.</p>
          <p>Supply extends across Jharkhand, Odisha, West Bengal, Bihar, Uttar Pradesh and Chhattisgarh, elsewhere in India, and to export enquiries.</p>
        </article>

        <article class="panel">
          <h2>How long we have done it</h2>
          <p>PK INDUSTRIES was established in 1996. Three decades of continuity in one product family is the main thing we would ask a buyer to weigh, because consumables reward accumulated process knowledge more than they reward novelty.</p>
          <p>The company operates an ISO 9001:2015 quality management system.</p>
        </article>
      </div>

      <section class="section" style="padding-top:2.4rem">
        <div class="section-heading">
          <p class="eyebrow">How we work</p>
          <h2>Trials before volume</h2>
        </div>
        <p>Nobody should change a consumable across a whole shop on the strength of a datasheet. Our normal route is a trial quantity against a defined problem, with the measurement agreed before the trial starts, so the result is a number both sides accept rather than an impression.</p>
        <p>Where a grade needs adjusting for a particular steel grade, section size or ladle practice, we adjust it. That is the part of this business that does not appear in any specification.</p>
        <p>Technical background for each product is published in the
           <a href="documentation.html">documentation hub</a>, with peer-reviewed sources collected in the
           <a href="research-hub.html">research hub</a> and terminology in the
           <a href="glossary.html">glossary</a>.</p>
      </section>
"""

EXPORTS_BODY = """
      <div class="content-grid">
        <article class="panel">
          <h2>Enquiries from outside India</h2>
          <p>PK INDUSTRIES accepts export enquiries for its full range: casting powder, nozzle filling compound, refractory castable, mortar and ladle covering compound.</p>
          <p>Export enquiries are handled the same way as domestic ones. Tell us the casting route and the problem, and the response is a grade recommendation with the supporting technical detail.</p>
        </article>

        <article class="panel">
          <h2>What to send with an export enquiry</h2>
          <ul class="doc-list">
            <li>Destination port or nearest city</li>
            <li>Product and approximate quantity</li>
            <li>Steel grades and casting route</li>
            <li>Packing preference, if your plant has a standard</li>
            <li>Any documentation your import process requires</li>
          </ul>
          <p>Quantity and destination determine packing and shipping mode, so both are worth including in the first message.</p>
        </article>

        <article class="panel">
          <h2>Packing and documentation</h2>
          <p>Consumables of this type are moisture-sensitive to varying degrees, and sea freight is a long exposure. Packing is specified per consignment against the destination and transit time rather than applied as one default.</p>
          <p>Commercial and shipping documentation is prepared per consignment. If your import process needs a specific document set, send the list with your enquiry.</p>
        </article>
      </div>

      <section class="section" style="padding-top:2.4rem">
        <div class="section-heading">
          <p class="eyebrow">Next step</p>
          <h2>Start an export enquiry</h2>
        </div>
        <p>Email <a href="mailto:info@pkindustries.net">info@pkindustries.net</a> or message
           <a href="https://wa.me/919431342715" target="_blank" rel="noopener">+91 94313 42715</a> on WhatsApp.
           Include destination and quantity so the first reply can be useful.</p>
        <p><a class="btn btn-primary" href="/#contact">Open the enquiry form</a></p>
      </section>
"""

PRIVACY_BODY = """
      <section class="section" style="padding-top:0">
        <h2>What this page covers</h2>
        <p>This policy explains what PK INDUSTRIES collects through pkindustries.net, why, and what you can ask us to do about it. It covers this website only.</p>

        <h2>What we collect</h2>
        <p><strong>Information you send us.</strong> If you submit the enquiry form or the guided enquiry, we receive what you typed: your name, company, email address, phone number if you provide one, the product you are interested in, and your description of the problem. We ask for these because an enquiry cannot be answered usefully without them.</p>
        <p><strong>Usage data.</strong> We use Google Analytics 4 to understand which pages are read and which are not. This records information such as approximate location derived from IP address, device type, browser, referring site, and pages viewed. IP addresses are anonymised. We do not use this data to identify individuals.</p>
        <p>Our analytics script does not load at all if your browser sends a Global Privacy Control or Do Not Track signal.</p>

        <h2>What we do not do</h2>
        <ul class="doc-list">
          <li>We do not sell or rent your information.</li>
          <li>We do not run advertising or remarketing pixels on this site.</li>
          <li>We do not collect payment details through this website.</li>
          <li>We do not send marketing email to addresses collected through enquiries unless you ask us to.</li>
        </ul>

        <h2>Who else handles it</h2>
        <p>Enquiry submissions are processed by our form provider so that they reach us as email. Analytics data is processed by Google. Both process this data on our behalf and under their own terms. The site is served through Amazon Web Services.</p>

        <h2>How long we keep it</h2>
        <p>Enquiry correspondence is kept as long as it is commercially relevant, in the same way as any other business correspondence. Analytics data is retained according to the retention period configured in Google Analytics.</p>

        <h2>Your choices</h2>
        <p>You can ask us what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to <a href="mailto:info@pkindustries.net">info@pkindustries.net</a> and we will act on it.</p>
        <p>You can block analytics entirely with a browser setting, an extension, or by enabling Global Privacy Control.</p>

        <h2>Cookies</h2>
        <p>Google Analytics sets cookies to distinguish repeat visits from new ones. Your language preference, if you set one, is stored in your browser rather than sent to us. No other cookies are set by this site.</p>

        <h2>Changes</h2>
        <p>If this policy changes, the revised version appears on this page. The date below reflects the last revision.</p>
        <p class="last-updated">Last updated: August 11, 2026</p>
      </section>
"""

PAGES = {
    "contact.html": {
        "title": "Contact PK INDUSTRIES, Adityapur, Jamshedpur",
        "description": "Contact PK INDUSTRIES in Adityapur, Jamshedpur, Jharkhand. Phone, WhatsApp, email, hours, and what to include in a technical enquiry.",
        "eyebrow": "Contact",
        "h1": "Contact PK INDUSTRIES",
        "lead": "Adityapur, Jamshedpur, Jharkhand. Monday to Saturday, 8:00 to 20:00 IST.",
        "body": CONTACT_BODY,
        "schema_type": "ContactPage",
        "image": "sms-hero",
    },
    "about.html": {
        "title": "About PK INDUSTRIES, Manufacturing Since 1996",
        "description": "PK INDUSTRIES manufactures steel melting shop consumables in Adityapur, Jamshedpur, Jharkhand. Established 1996, ISO 9001:2015, supplying across India and for export.",
        "eyebrow": "About",
        "h1": "About PK INDUSTRIES",
        "lead": "A consumables manufacturer in Adityapur, Jamshedpur, Jharkhand, working in one product family since 1996.",
        "body": ABOUT_BODY,
        "schema_type": "AboutPage",
        "image": "landing-about-sms",
    },
    "exports.html": {
        "title": "Steel Plant Consumables Export, Jamshedpur, India",
        "description": "PK INDUSTRIES accepts export enquiries for casting powder, nozzle filling compound, refractory castable, mortar and ladle covering compound from Jamshedpur, India.",
        "eyebrow": "Exports",
        "h1": "Export enquiries",
        "lead": "Steel melting shop consumables manufactured in Jharkhand, India, for buyers outside India.",
        "body": EXPORTS_BODY,
        "schema_type": "WebPage",
        "image": "landing-process-sms",
    },
    "privacy.html": {
        "title": "Privacy Policy | PK INDUSTRIES",
        "description": "How PK INDUSTRIES handles information submitted through pkindustries.net, what analytics we use, and how to request deletion.",
        "eyebrow": "Legal",
        "h1": "Privacy policy",
        "lead": "What we collect through this website, why, and what you can ask us to do about it.",
        "body": PRIVACY_BODY,
        "schema_type": "WebPage",
        "image": "goal-strong-shining-billets",
        "noindex": False,
    },
}


def page_html(name, p, nav, footer, tail):
    url = f"{SITE}/{name}"
    crumb_name = p["eyebrow"]
    schema = f'''{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "{p['schema_type']}",
      "@id": "{url}#webpage",
      "url": "{url}",
      "name": "{p['title']}",
      "description": "{p['description']}",
      "isPartOf": {{ "@id": "{SITE}/#website" }},
      "about": {{ "@id": "{SITE}/#organization" }},
      "inLanguage": "en-IN"
    }},
    {{
      "@type": "BreadcrumbList",
      "@id": "{url}#breadcrumb",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "{SITE}/" }},
        {{ "@type": "ListItem", "position": 2, "name": "{crumb_name}", "item": "{url}" }}
      ]
    }}
  ]
}}'''

    return f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta name="description" content="{p['description']}">
  <meta name="author" content="PK INDUSTRIES">
  <meta name="theme-color" content="#06090f">
  <title>{p['title']}</title>
  <link rel="canonical" href="{url}">
  <link rel="alternate" type="application/rss+xml" title="PK INDUSTRIES Blog" href="/feed.xml">
  <link rel="alternate" hreflang="en-in" href="{url}">
  <link rel="alternate" hreflang="x-default" href="{url}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_IN">
  <meta property="og:url" content="{url}">
  <meta property="og:site_name" content="PK INDUSTRIES">
  <meta property="og:title" content="{p['title']}">
  <meta property="og:description" content="{p['description']}">
  <meta property="og:image" content="{SITE}/img/{p['image']}.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{p['title']}">
  <meta name="twitter:description" content="{p['description']}">
  <meta name="twitter:image" content="{SITE}/img/{p['image']}.jpg">

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/img/logo1.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="css/modern-dark.css">
  <link rel="stylesheet" href="css/docs.css">

  <script type="application/ld+json">
{schema}
  </script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <header class="site-header page-header" id="top">
{nav}
  </header>

  <main id="main-content">
    <section class="section shell">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">{crumb_name}</span></nav>
      <div class="section-heading">
        <p class="eyebrow">{p['eyebrow']}</p>
        <h1>{p['h1']}</h1>
        <p class="lead">{p['lead']}</p>
      </div>
{p['body']}
    </section>
  </main>

{footer}
{tail}</body>
</html>
'''


def main():
    nav, footer, tail = chrome()
    for name, p in PAGES.items():
        with open(os.path.join(ROOT, name), "w", encoding="utf-8") as fh:
            fh.write(page_html(name, p, nav, footer, tail))
        print(f"  wrote {name}")
    print(f"built {len(PAGES)} page(s)")


if __name__ == "__main__":
    main()
