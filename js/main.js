document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("open-popup-btn");
    const popup = document.querySelector(".Popup");
    const closeBtn = document.querySelector(".btn-close");

    openBtn.addEventListener("click", function () {
        popup.classList.add("active");
        document.querySelector('.BG-color').classList.add('active');
    });

    closeBtn.addEventListener("click", function () {
        popup.classList.remove("active");
        document.querySelector('.BG-color').classList.remove('active');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("open-popup-sign");
    const popup = document.getElementById("Popup-sign");
    const closeBtn = document.getElementById("btn-close");

    openBtn.addEventListener("click", function () {
        popup.classList.add("active");
        document.querySelector('.BG-color').classList.add('active');
    });

    closeBtn.addEventListener("click", function () {
        popup.classList.remove("active");
        document.querySelector('.BG-color').classList.remove('active');
    });
});
function addToCart(name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra nếu sản phẩm đã có thì tăng số lượng
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
  }

// slideshow
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    let currentSlide = 0;

    // Tạo dots
    slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
    dot.addEventListener('click', () => goToSlide(i));
    });

    function goToSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
    document.querySelector('.slides').style.transform = `translateX(-${n * 100}%)`;

    const dots = document.querySelectorAll('.dots span');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[n].classList.add('active');

    currentSlide = n;
    }

    document.querySelector('.next').onclick = () => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
    };

    document.querySelector('.prev').onclick = () => {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
    };
});

window.onload = function () {
    if (window.google && google.accounts && google.accounts.id) {
      const auth = new UserAuth();
      auth.initGoogleSignIn();
    } else {
      console.error("Google API chưa sẵn sàng");
    }
  };
// User Authentication
class UserAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
        this.initGoogleSignIn();
    }

    init() {
        // Initialize forms
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const loginToggle = document.getElementById('loginToggle');
        const signupToggle = document.getElementById('signupToggle');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Add toggle button event listeners
        if (loginToggle && signupToggle) {
            loginToggle.addEventListener('click', () => this.toggleForms('login'));
            signupToggle.addEventListener('click', () => this.toggleForms('signup'));
        }

        // Update UI based on login status
        this.updateAccountUI();
    }

    initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: "1029582278212-0949khufaaiko67p7efvpu0bqjrhdj7c.apps.googleusercontent.com",
            callback: this.handleGoogleSignIn.bind(this)
        });

        google.accounts.id.renderButton(
            document.getElementById("google-btn"),
            { 
                theme: "outline", 
                size: "large",
                width: "300px",
                text: "signin_with"
            }
        );
    }

    handleGoogleSignIn(response) {
        const data = jwt_decode(response.credential);
        
        // Check if user already exists
        let user = this.users.find(u => u.email === data.email);
        
        if (!user) {
            // Create new user if doesn't exist
            user = {
                name: data.name,
                email: data.email,
                password: '', // No password needed for Google users
                isGoogleUser: true
            };
            this.users.push(user);
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        // Set current user
        this.currentUser = {
            name: user.name,
            email: user.email,
            isGoogleUser: true
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Update UI and close popup
        this.updateAccountUI();
        this.closePopup();
        alert(`Đăng nhập thành công với Google! Chào ${data.name}`);
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = { name: user.name, email: user.email };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateAccountUI();
            this.closePopup();
            alert('Đăng nhập thành công!');
        } else {
            alert('Email hoặc mật khẩu không đúng!');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (this.users.some(u => u.email === email)) {
            alert('Email đã được sử dụng!');
            return;
        }

        this.users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(this.users));
        alert('Đăng ký thành công!');
        this.closePopup();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAccountUI();
    }

    updateAccountUI() {
        const accountDiv = document.querySelector('.account');
        if (!accountDiv) return;

        if (this.currentUser) {
            accountDiv.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-menu">
                        <div class="user-info">
                            <span>Thông tin tài khoản: </span>
                            <span>Name: ${this.currentUser.name}</span>
                            <span>Email: ${this.currentUser.email}</span>
                        </div>
                        <ul>
                            <li><a href="/cart.html" class="courses-link">Giỏ hàng của tôi</a></li>
                            <li><a href="#" class="logout-link">Đăng xuất</a></li>
                        </ul>
                    </div>
                </div>
            `;

            // Add event listeners for user menu
            const logoutLink = accountDiv.querySelector('.logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', () => this.logout());
            }
        } else {
            accountDiv.innerHTML = `
                <div class="signup">
                    <button class="btn-signup" id="open-popup-sign">Đăng ký</button>
                </div>
                <div class="login">
                    <button class="btn-login" id="open-popup-btn">Đăng nhập</button>
                </div>
            `;

            // Reinitialize popup buttons
            this.initPopupButtons();
        }
    }

    initPopupButtons() {
        const openLoginBtn = document.getElementById('open-popup-btn');
        const openSignupBtn = document.getElementById('open-popup-sign');
        const closeBtn = document.getElementById('btn-close');

        if (openLoginBtn) {
            openLoginBtn.addEventListener('click', () => this.openPopup());
        }
        if (openSignupBtn) {
            openSignupBtn.addEventListener('click', () => this.openPopup());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePopup());
        }
    }

    openPopup() {
        document.querySelector('.Popup').classList.add('active');
        document.querySelector('.BG-color').classList.add('active');
    }

    closePopup() {
        document.querySelector('.Popup').classList.remove('active');
        document.querySelector('.BG-color').classList.remove('active');
    }

    toggleForms(formType) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const loginToggle = document.getElementById('loginToggle');
        const signupToggle = document.getElementById('signupToggle');

        if (formType === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            document.querySelector('.Login-popup header h2').textContent = 'Đăng nhập vào f8';
        } else {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            loginToggle.classList.remove('active');
            signupToggle.classList.add('active');
            document.querySelector('.Login-popup header h2').textContent = 'Đăng ký tài khoản f8';
        }
    }
}

// Initialize user authentication
document.addEventListener('DOMContentLoaded', () => {
    new UserAuth();
});

document.querySelectorAll('.heart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('.fa-heart');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Ẩn tất cả .content khi trang load
    document.querySelectorAll('.content').forEach(function(content) {
      content.style.display = 'none';
    });
  });
  
  // Toggle accordion khi click
  function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.icon');
  
    if (content.style.display === 'none' || content.style.display === '') {
      content.style.display = 'block';
      icon.textContent = '-';
    } else {
      content.style.display = 'none';
      icon.textContent = '+';
    }
  }
  
function handleCredentialResponse(response) {
    // Decode the JWT token
    const responsePayload = jwt_decode(response.credential);
    
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Here you can handle the sign-in response
    // For example, send the token to your backend or update the UI
}
  
