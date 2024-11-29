document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const countrySelect = document.getElementById('country');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Configuración de países
    const countries = {
        CO: {
            name: 'Colombia',
            code: '+57',
            currency: 'COP'
        },
        PE: {
            name: 'Perú',
            code: '+51',
            currency: 'PEN'
        },
        MX: {
            name: 'México',
            code: '+52',
            currency: 'MXN'
        },
        // Agregar más países según sea necesario
    };

    // Manejar el envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            country: countrySelect.value,
            username: usernameInput.value,
            password: passwordInput.value
        };

        try {
            // Aquí iría la llamada al API de autenticación
            const response = await mockLogin(formData);
            
            if (response.success) {
                // Guardar el token y redirigir al catálogo
                localStorage.setItem('authToken', response.token);
                window.location.href = './catalog.html';
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError('Error al iniciar sesión. Por favor intenta nuevamente.');
        }
    });

    // Función mock para simular el login
    async function mockLogin(formData) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Credenciales de prueba
        if (formData.username === '1232596362' && formData.password === '1232596362') {
            return {
                success: true,
                token: 'mock-token-123',
                userData: {
                    name: 'Usuario de Prueba',
                    country: formData.country,
                    role: 'consultant'
                }
            };
        }

        return {
            success: false,
            message: 'Credenciales inválidas'
        };
    }

    // Función para mostrar errores
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const form = document.querySelector('.login-form');
        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Función para validar el formulario
    function validateForm() {
        const country = countrySelect.value;
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!country) {
            showError('Por favor selecciona un país');
            return false;
        }

        if (!username) {
            showError('Por favor ingresa tu usuario o correo electrónico');
            return false;
        }

        if (!password) {
            showError('Por favor ingresa tu contraseña');
            return false;
        }

        return true;
    }
});
