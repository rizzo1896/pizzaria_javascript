let cart = []
let modalQt = 1
let modalKey = 0

const query = (el) => document.querySelector(el)
const queryAll = (el) => document.querySelectorAll(el)

pizzaJson.map((item, index) => {
    let pizzaItem = query('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description


    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1
        modalKey = key

        query('.pizzaBig img').src = pizzaJson[key].img
        query('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        query('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        query('.pizzaInfo--size.selected').classList.remove('selected')


        queryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        query('.pizzaInfo--qt').innerHTML = modalQt

        //box transition
        query('.pizzaWindowArea').style.opacity = 0
        query('.pizzaWindowArea').style.display = 'flex'

        setTimeout(() => {
            query('.pizzaWindowArea').style.opacity = 1
        }, 100)
    })

    query('.pizza-area').append(pizzaItem)
})


// Modal events

function closeModal() {
    query('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        query('.pizzaWindowArea').style.display = 'none'
    }, 100)
}

queryAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

query('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--
        query('.pizzaInfo--qt').innerHTML = modalQt
    }
})

query('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    query('.pizzaInfo--qt').innerHTML = modalQt
})

queryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        query('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

query('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(query('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = pizzaJson[modalKey].id + '@' + size
    let key = cart.findIndex((item) => item.identifier == identifier)
    if (key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    updateCart()
    closeModal()
})

query('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        query('aside').style.left = 0
    }
})

query('.menu-closer').addEventListener('click', ()=>{
    query('aside').style.left = '100vw'
})

function updateCart() {

    query('.menu-openner span').innerHTML = cart.length

    if (cart.length > 0) {
        query('aside').classList.add('show')
        query('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt

            let cartItem = query('.models .cart--item').cloneNode(true)

            let pizzaSizeName
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }

            let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                updateCart()
            })

            query('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        query('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        query('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        query('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        query('aside').classList.remove('show')
        query('aside').style.left = '100vw'
    }
}