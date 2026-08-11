(function () {
  var form = document.getElementById('assistantForm');
  var preview = document.getElementById('messagePreview');
  var whatsappDraft = document.getElementById('whatsappDraft');
  var copyButton = document.getElementById('copyMessage');
  var chatLog = document.getElementById('chatLog');
  var submitButton = document.getElementById('submitAssistant');
  var submitStatus = document.getElementById('submitStatus');
  var formkeepMessage = document.getElementById('formkeepMessage');
  var formkeepFrame = document.getElementById('formkeepSubmitFrame');
  var hasSubmitted = false;
  var usedFrameFallback = false;

  if (!form || !preview || !whatsappDraft) {
    return;
  }

  function valueOf(id) {
    var node = document.getElementById(id);
    return node ? node.value.trim() : '';
  }

  function line(label, value) {
    return label + ': ' + (value || 'Not shared');
  }

  function buildMessage() {
    var product = valueOf('productName');
    var location = valueOf('plantLocation');
    var steelGrade = valueOf('steelGrade');
    var issue = valueOf('currentIssue');
    var quantity = valueOf('quantity');
    var buyer = valueOf('buyerName');

    return [
      'Hello PK INDUSTRIES,',
      '',
      'We have a product requirement. Please review the details and suggest a suitable grade / quotation.',
      '',
      line('Product', product),
      line('Plant Location', location),
      line('Steel Grade / Application', steelGrade),
      line('Current Issue', issue),
      line('Trial Quantity / Monthly Requirement', quantity),
      line('Name / Company', buyer),
      '',
      'Please share technical recommendation, packing, lead time, and price details.'
    ].join('\n');
  }

  function addBubble(text, type) {
    if (!chatLog) {
      return;
    }

    var bubble = document.createElement('p');
    bubble.className = 'chat-bubble ' + type;
    bubble.textContent = text;
    chatLog.appendChild(bubble);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var message = buildMessage();
    preview.value = message;
    if (formkeepMessage) {
      formkeepMessage.value = message;
    }
    whatsappDraft.href = 'https://wa.me/919431342715?text=' + encodeURIComponent(message);
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }
    if (submitStatus) {
      submitStatus.textContent = 'Sending enquiry through Formkeep...';
    }
    addBubble('Submitting your enquiry to PK INDUSTRIES. WhatsApp draft is also ready for faster follow-up.', 'bot');
    hasSubmitted = true;

    function settle(text, bubble) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Again';
      }
      if (submitStatus) {
        submitStatus.textContent = text;
      }
      addBubble(bubble, 'bot');
    }

    // Prefer fetch: it is the only path that reports a real HTTP status. The
    // iframe fallback below cannot tell success from failure at all, because
    // its load event fires for error pages too and the response is
    // cross-origin, so nothing about it is readable.
    if (window.fetch) {
      window.fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) { throw new Error(response.status); }
        settle('Enquiry submitted. You can also open WhatsApp to follow up immediately.',
               'Enquiry submitted. For urgent requirements, please also send the WhatsApp draft.');
      }).catch(function () {
        submitViaFrame();
      });
      return;
    }

    submitViaFrame();
  });

  function submitViaFrame() {
    if (!formkeepFrame) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Again';
      }
      if (submitStatus) {
        submitStatus.textContent = 'We could not send that automatically. Please use the WhatsApp draft below.';
      }
      addBubble('We could not send that automatically. Please use the WhatsApp draft below, or call +91 94313 42715.', 'bot');
      return;
    }
    usedFrameFallback = true;
    HTMLFormElement.prototype.submit.call(form);
  }

  if (formkeepFrame) {
    formkeepFrame.addEventListener('load', function () {
      if (!hasSubmitted || !usedFrameFallback) {
        return;
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Again';
      }
      // Deliberately hedged. On this path we do not know whether it worked, so
      // claiming "submitted" would be a guess presented as a fact.
      if (submitStatus) {
        submitStatus.textContent = 'Enquiry sent. Delivery could not be confirmed from this browser, so please also send the WhatsApp draft.';
      }
      addBubble('Enquiry sent, but we could not confirm delivery from here. Please also send the WhatsApp draft so nothing is missed.', 'bot');
    });
  }

  if (copyButton && navigator.clipboard) {
    copyButton.addEventListener('click', function () {
      navigator.clipboard.writeText(preview.value).then(function () {
        copyButton.textContent = 'Copied';
        window.setTimeout(function () {
          copyButton.textContent = 'Copy Message';
        }, 1600);
      });
    });
  }
})();
