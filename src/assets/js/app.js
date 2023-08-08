// Header fixed

const header = document.querySelector('#header');

if (header) {
    window.addEventListener('scroll', (event) => {
        window.scrollY >= 1 ? header.classList.add('header--darken') : header.classList.remove('header--darken');
    });
}


//  Burger menu

const burgerBtn = document.querySelector('#navToggle'),
      nav = document.querySelector('#nav'),
      body = document.querySelector('body');


burgerBtn.addEventListener('click', (event) => {
    event.preventDefault();

    burgerBtn.classList.toggle('active');
    nav.classList.toggle('show');
    body.classList.toggle('show-nav');
});

window.addEventListener('resize',(e) => {
    burgerBtn.classList.remove('active');
    nav.classList.remove('show');
    body.classList.remove('show-nav');
});



// Modal

const cartBtn = document.querySelector('[data-cart]'),
      cartModal = document.querySelector('#cart-modal'),
      modal = document.querySelector('.modal'),
      modalContent = document.querySelector('.modal__inner');


function modalClose() {
    body.classList.remove('no-scroll');
    modal.classList.remove('show');
    
    modalContent.style.transform = 'translateY(-50px)';
    modalContent.style.opacity = '0';
}

function modalOpen() {
    body.classList.add('no-scroll');
    modal.classList.add('show');

    setTimeout(() => {
        modalContent.style.transform = 'translateY(0)';
        modalContent.style.opacity = '1';
    }, 1);
}


cartBtn.addEventListener('click', event => {
    event.preventDefault();
    modalOpen();
});


modal.addEventListener('click', event => {
    event.preventDefault();
    if(event.target === modal || event.target.getAttribute('data-close') == '') {
        modalClose();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === "Escape" && modal.classList.contains('show')) {
        modalClose();
    }
});



// Form validation 

let form = document.querySelector('#form'),
    userName = document.querySelector('#username'),
    email = document.querySelector('#email'),
    phone = document.querySelector('#phone'),
    massage = document.querySelector('#textarea'),
    checkbox = document.querySelector('#checkbox'),
    password = document.querySelector('#password');


const setError = (element, massage) => {
    const inputControl = element?.parentElement;
    const errorDisplay = inputControl?.querySelector('.form__error');

    if(element) {
        errorDisplay.innerText = massage;
        inputControl.classList.add('error'),
        inputControl.classList.remove('success');
    }
};

const setSuccess = element => {
    const inputControl = element?.parentElement;
    const errorDisplay = inputControl?.querySelector('.form__error');

    if (element) {
        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }
};

const isValidUserName = username => {
    const re = /^([а-яё\s]+|[a-z\s]+)$/iu;
    return re.test(String(username));
};


const isValidEmail = email => {
    const re = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u;
    return re.test(String(email));
};


const isValidPhone = phone => {
    const re = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
    return re.test(String(phone));
};


const validateInputs = () => {
    const usernameValue = userName?.value.trim(),
          emailValue = email?.value.trim(),
          phoneValue = phone?.value.trim(),
          massageValue = massage?.value.trim(),
          passwordValue = password?.value.trim();

    if (usernameValue === '') {
        setError(userName, 'Please enter a name');
    } else if (!isValidUserName(usernameValue)) {
        setError(userName, 'The name cannot consist of numbers and contain letters from different languages');
    } else if (usernameValue?.length < 2) {
        setError(userName, 'Name must have at least two characters');
    } else {
        setSuccess(userName);
    }

    if (emailValue === '') {
        setError(email, 'Please enter your email address');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Please enter your email address in the correct format');
    } else {
        setSuccess(email);
    }

    if (phoneValue === '') {
        setError(phone, 'Please enter your phone number');
    } else if (!isValidPhone(phoneValue)) {
        setError(phone, 'Please enter your phone number in the correct format');
    } else {
        setSuccess(phone);
    }


    if (massageValue === '') {
        setError(massage, 'The message field must not be empty. Please tell me what interests you.');
    } else if (massageValue?.length < 20 ) {
        setError(massage, 'The message field must contain at least twenty characters.');
    } else {
        setSuccess(massage);
    }

    if (passwordValue === '') {
        setError(password, 'The message field must not be empty. Please enter your password.');
    } else if (passwordValue?.length < 7 ) {
        setError(password, 'The message field must contain at least seven characters.');
    } else {
        setSuccess(password);
    }


    if (checkbox?.checked == false) {
        checkbox.nextElementSibling.style.borderColor = 'red';
    } else if (checkbox) {
        checkbox.nextElementSibling.style.borderColor = 'green';
    }
};


if (form) {
    form.addEventListener('submit', event => {
        event.preventDefault();

        validateInputs();
    });
}



// Accordion

const accordion = document.querySelectorAll('[data-accordion]');

accordion.forEach(element => {
    element.addEventListener('click', event => {

        if (element.classList.contains('active')) {
            element.lastElementChild.classList.add('fade-down');
        }

        element.classList.toggle('active');

        element.lastElementChild.classList.toggle('fade-down');
    });
});



// Counter

totalUsdPrice(calcCartPrice());
checkCartStatus();

window.addEventListener('click', (event) => {

    const productCount =  event.target?.closest('.product__count'),
          counter = productCount?.querySelector('[data-counter]');

    if(event.target.dataset.action === 'plus') {

        if (parseInt(counter.value) < 100) {
            counter.value = ++counter.value;
            totalUsdPrice(calcCartPrice());
        }
    }

    if(event.target.dataset.action === 'minus') {
        if (parseInt(counter.value) > 1) {
            counter.value = --counter.value;
            totalUsdPrice(calcCartPrice());
        }
    }

    if (event.target.dataset.delete == '') {
        event.target.closest('.cart__product').remove();
        totalUsdPrice(calcCartPrice());
        checkCartStatus();
    }

    if (event.target.dataset.counter == '') {
        counter.addEventListener('input', (event) => {

            if (parseInt(counter.value) > 100) {
                counter.value = 100;
            }

            if (parseInt(counter.value) < 1 || counter.value == '') {
                counter.value = 1;
            }

            totalUsdPrice(calcCartPrice());
        });
    }
});

function getPriceNumber(price) {
    let string = '';
        for (let index in price) {
            if (isFinite(price[index]) || price[index] == '.')  {
                string += price[index];
            }
        }
    return parseFloat(string);
}

function calcCartPrice() {
    const cartsItem = document.querySelectorAll('.cart__product');

    let totalPrice = 0;

    cartsItem.forEach(item => {
        const amountEl = item.querySelector('[data-counter]'),
              price = item.querySelector('[data-price]');

            const currentPrice = getPriceNumber(amountEl.value) * getPriceNumber(price.innerText);
            totalPrice += currentPrice;
    });

    return totalPrice.toFixed(2);
}

function totalUsdPrice(totalPrice) {
    const totalCount = document.querySelector('[data-total]');
    
    totalCount.innerText = `$ ${totalPrice}  USD`;
}

function checkCartStatus() {
    const cartContent = document.querySelector('.cart__content'),
          cartCountNumber = document.querySelector('.nav__link-icon__img-bage');

    if (cartContent.children.length == 0) {
        cartContent.innerText = 'Your cart is empty';
    }
    
    cartCountNumber.innerText = cartContent.children.length < 10 ? `0${cartContent.children.length}` : cartContent.children.length;
}



// Tabs

const tab = document?.querySelectorAll('[data-tab]'),
      tabsContent = document?.querySelectorAll('.product__description-content'),
      tabsParent = document?.querySelector('.product__description');


function hideTabContent() {
    tabsContent?.forEach((item, i) => {
        item.classList.add('hide');
        item.classList.remove('show', 'fade-down');
    });
}

function showTabContent(i = 0) {
    tabsContent[i]?.classList.add('show', 'fade-down');
    tabsContent[i]?.classList.remove('hide');
}

hideTabContent();
showTabContent();

tabsParent?.addEventListener('click', event => {
    const target = event.target;
    event.preventDefault();

    if (target && target.classList.contains('btn')) {
        tab.forEach((item, i) => {
            if (target == item) {
                hideTabContent();
                showTabContent(i);
            }
        });
    }
});










































