const state = {
  cardBrands: ['mastercard','visa']
}

async function init() {
  const libJS = document.createElement('script')
  libJS.src = 'https://sandbox.src.mastercard.com/srci/integration/2/lib.js'
  await document.body.appendChild(libJS)
  libJS.addEventListener('load', async function() {
    const c2p = new window.Click2Pay({debug: true })
    try {
      console.log('cardBrands', state.cardBrands)
      console.log(await c2p.init({
        srcDpaId: 'b756a2b0-ef62-4c62-a6de-f72e75ce5f17',
        dpaData: {
          dpaName: 'Yara Greyjoy'
        },
        dpaLocale: 'en_US',
        cardBrands: state.cardBrands
      }))
      const cards = await c2p.getCards()
      if(cards.length) {
        const cardList = document.createElement('src-card-list')
        customElements.whenDefined('src-card-list')
        cardList.loadCards(cards)
        cardList.cardBrands = state.cardBrands
        document.body.appendChild(cardList)
      } else {
        const lookupResult = await c2p.idLookup({ email: document.querySelector('#email').value })
        console.log(lookupResult)
        if(!lookupResult.consumerPresent) {
          console.warn('account not found')
        }

        await c2p.initiateValidation()

        const otpInput = document.createElement('src-otp-input')
        await customElements.whenDefined('src-otp-input')
        otpInput.cardBrands = state.cardBrands
        otpInput.displayHeader = true
        otpInput.type = "overlay"
        otpInput.addEventListener('otpChanged', (event) => {
          handleOTP(event, c2p, otpInput)
        })
        otpInput.addEventListener('input', console.log)
        document.body.appendChild(otpInput)
      }
    } catch (e) {
      console.log(e)
    }
  })
}

async function initMerchantJS() {
  const merchJsScript = document.createElement('script')
  merchJsScript.src = 'https://sandbox.src.mastercard.com/srci/merchant/merchant.js?checkoutid=ca1faacf4d734247be5fce22d0270421'
  await document.body.appendChild(merchJsScript)
  merchJsScript.addEventListener('load', async function() {
    window.masterpass.checkout({
      allowedCardTypes: ['master,amex,diners,discover,jcb,maestro,visa'],
      amount: '150',
      currency: 'USD',
      checkoutId: 'ca1faacf4d734247be5fce22d0270421',
      displayLanguage: 'en_US',
      cartId: '506610f5-6858-4147-9ec2-b030f1337a7d',
      shippingLocationProfile: 'US',
      suppress3Ds: true,
      suppressShippingAddress: true
    })
  })
}

function updateCardBrands(event) {
  state.cardBrands = event.target.value.split(',')
  document.querySelector('src-mark').cardBrands = state.cardBrands
  document.querySelector('src-button').cardBrands = state.cardBrands
}

async function handleOTP(event, c2p, otpInput) {
  try {
    const cards = await c2p.validate({ value: event.detail })
    console.warn(cards)
    if (cards.length) {
      otpInput.remove()
      const cardList = document.createElement('src-card-list')
      customElements.whenDefined('src-card-list')
      cardList.loadCards(cards)
      cardList.cardBrands = state.cardBrands
      document.body.appendChild(cardList)
    } else {
      otpInput.remove()
      console.warn('no cards found')
    }
  } catch(e) {
    console.log(e)
  }
}

function removeAllSettled() {
  console.log('Before removal', Promise.allSettled)
  Promise.allSettled = undefined
  console.log('After removal', Promise.allSettled)
}

(async function() {
  await customElements.whenDefined('src-mark')
  const mark = document.querySelector('src-mark')
  mark.cardBrands = state.cardBrands

  await customElements.whenDefined('src-button')
  const masterpassButton = document.querySelector('src-button')

  cardBrandsInput = document.querySelector('#cardBrands')
  cardBrandsInput.value = state.cardBrands.join(',')
  emailInput = document.querySelector('#email')
  cardBrandsInput.addEventListener('input', updateCardBrands)
  document.querySelector('button').addEventListener('click', removeAllSettled)

  mark.addEventListener('click', init)
  masterpassButton.addEventListener('click', initMerchantJS)
})()

