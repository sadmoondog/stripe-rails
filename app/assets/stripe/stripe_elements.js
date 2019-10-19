// Create a Stripe client.
var stripe = Stripe(window.stripe_publishable_key);

// Create an instance of Elements.
var elements = stripe.elements();

var card = elements.create('card');
card.mount('#card-element');

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});


var form = document.getElementById('stripe-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  var cardButton = document.getElementById('card-button');
  var clientSecret = cardButton.dataset.secret;
  var clientEmail = cardButton.dataset.email;

  stripe.handleCardPayment(
      clientSecret, card, {
        payment_method_data: {
          billing_details: {name: clientEmail}
        }
      }
  ).then(function(result) {
    if (result.error) {
      // Display error.message in your UI.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // The payment has succeeded. Display a success message.
      stripeTokenHandler(result);
    }
  });
})

function stripeTokenHandler(data) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('stripe-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeData');
  hiddenInput.setAttribute('value', data);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}
