const state = {
  cardBrands: ['mastercard'],
  email: 'mbmc@mailinator.com'
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
          dpaName: 'SparkTmerch'
        },
        dpaLocale: 'en_US',
        cardBrands: state.cardBrands
      }))

      console.log(await c2p.idLookup({ email: state.email }))

      try { await c2p.initiateValidation() } catch(e) { console.log(e)}

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
    } catch (e) {
      console.log(e)
    }
  })
}

function updateCardBrands(event) {
  state.cardBrands = event.target.value.split(',')
  document.querySelector('src-mark').cardBrands = state.cardBrands
}

function updateEmail(event) {
  state.email = event.target.value
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
  cardBrandsInput = document.querySelector('#cardBrands')
  cardBrandsInput.value = state.cardBrands
  emailInput = document.querySelector('#email')
  emailInput.value = state.email
  cardBrandsInput.addEventListener('input', updateCardBrands)
  document.querySelector('button').addEventListener('click', removeAllSettled)
  mark.addEventListener('click', init)
})()

