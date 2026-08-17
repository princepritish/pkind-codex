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
    HTMLFormElement.prototype.submit.call(form);
  });

  if (formkeepFrame) {
    formkeepFrame.addEventListener('load', function () {
      if (!hasSubmitted) {
        return;
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Again';
      }
      if (submitStatus) {
        submitStatus.textContent = 'Enquiry submitted. You can also open WhatsApp to follow up immediately.';
      }
      addBubble('Enquiry submitted. For urgent requirements, please also send the WhatsApp draft.', 'bot');
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
