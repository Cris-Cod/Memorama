class Memorama {


    constructor() {

        this.totalTarjetas = [];
        this.numeroTarjetas = 0;
        this.verificadorTarjetas = [];
        this.errores = 0;
        this.nivelDificultad = '';
        this.imagenesCorrectas = [];
        this.agregarTarjetas = [];

        this.$contenedorGeneral = document.querySelector('.contenedor-general');
        this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
        this.$pantallaBloqueada = document.querySelector('.pantalla-bloqueada');
        this.$mensaje = document.querySelector('h2.mensaje');
        this.$tipoMensaje = document.querySelector('.tipos-mensajes');
        this.$errorContenedor = document.createElement('div');
        this.$nivelDificultad = document.createElement('div');

        //Llamando a los eventos

        this.eventos()

    }

    eventos() {
        window.addEventListener('DOMContentLoaded', () => {
            this.seleccionDificultad();
            this.cargarPantalla();
            window.addEventListener('contextmenu', e => {
                e.preventDefault();
            }, false);
        })
    }


    seleccionDificultad() {
        const mensaje = prompt('Selecciona el nivel de dificultad: facil, intermedio o dificil. Si no seleccionas ningun nivel por defecto el nivel sera intermedio');

        if (!mensaje) {
            this.numeroIntentos = 5;
            this.nivelDificultad = 'Intermedio';
        } else {
            if (mensaje.toLowerCase() === 'facil' || mensaje.toLocaleLowerCase() === 'fácil') {
                this.numeroIntentos = 7;
                this.nivelDificultad = 'Facil'
            } else if (mensaje.toLocaleLowerCase() === 'intermedio') {
                this.numeroIntentos = 5;
                this.nivelDificultad = 'Intermedio';
            } else if (mensaje.toLowerCase() === 'dificil' || mensaje.toLocaleLowerCase() === 'difícil') {
                this.numeroIntentos = 3;
                this.nivelDificultad = 'Dificil';
            } else {
                this.numeroIntentos = 5;
                this.nivelDificultad = 'Intermedio';
            }
        }

        this.contenedorError();
        this.mensajeIntentos();


        //console.log(this.numeroIntentos, this.nivelDificultad);
    }


    async cargarPantalla() {
        const respuesta = await fetch('./memo.json');
        const data = await respuesta.json();

        this.totalTarjetas = data;

        if (this.totalTarjetas.length > 0) {
            this.totalTarjetas.sort(orden);

            function orden(a, b) {
                return Math.random() - 0.5;
            }
        }

        this.numeroTarjetas = this.totalTarjetas.length;

        //console.log(this.totalTarjetas);

        let html = '';
        this.totalTarjetas.forEach(card => {


            //console.log(card.src)
            html +=
                `<div class="tarjeta">
                <img class="tarjeta-img" src=${card.src} alt="imagen memorama">
                </div>`


        })



        this.$contenedorTarjetas.innerHTML = html;
        this.comienzajuego();

    }


    comienzajuego() {
        const tarjetas = document.querySelectorAll('.tarjeta');
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('click', e => {

                if (!e.target.classList.contains('acertada') && !e.target.classList.contains('tarjeta-img')) {
                    this.clickTarjeta(e);
                }

            })
        })
    }

    clickTarjeta(e) {

        this.efectoVoltearTarjeta(e);

        let sourceImage = e.target.childNodes[1].attributes[1].value;
        this.verificadorTarjetas.push(sourceImage);

        let tarjeta = e.target;
        this.agregarTarjetas.unshift(tarjeta);
        this.comparadorTarjetas();
    }

    efectoVoltearTarjeta(e) {
        e.target.style.backgroundImage = 'none';
        e.target.style.backgroundColor = "white";
        let cart = e.target.childNodes[1];
        cart.style.display = 'block';

    }


    fijaParAcertado(arrTarjetaAcertada) {
        arrTarjetaAcertada.forEach(tarjeta => {
            tarjeta.classList.add('acertada');
            this.imagenesCorrectas.push(tarjeta);
            this.victoriaJuego();
        })
    }

    reversoTarjetas(arrTarjetas) {
        arrTarjetas.forEach(tarjeta => {
            setTimeout(() => {
                tarjeta.style.backgroundImage = 'url(./img/cover.jpg)';
                let tar = tarjeta.childNodes[1];
                tar.style.display = 'none';
            }, 1000);
        })
    }

    comparadorTarjetas() {
        if (this.verificadorTarjetas.length == 2) {
            if (this.verificadorTarjetas[0] === this.verificadorTarjetas[1]) {
                this.fijaParAcertado(this.agregarTarjetas);
            } else {
                this.reversoTarjetas(this.agregarTarjetas);
                this.errores++;
                this.incrementadorError();
                this.derrotaJuego();
            }

            this.agregarTarjetas.splice(0);
            this.verificadorTarjetas.splice(0);

        }
    }

    victoriaJuego() {
        if (this.imagenesCorrectas.length === this.numeroTarjetas) {
            setTimeout(() => {
                let pantalla = this.$pantallaBloqueada;
                pantalla.style.display = 'block';
                this.$mensaje.innerText = '!Felicitaciones! Has ganado el juego';
            }, 1000);
            setTimeout(() => {
                location.reload();
            }, 4000);
        }
    }


    derrotaJuego() {
        if (this.errores === this.numeroIntentos) {
            setTimeout(() => {
                this.$pantallaBloqueada.style.display = 'block';
            }, 1000)
            setTimeout(() => {
                location.reload();
            }, 4000)
        }
    }

    incrementadorError() {
        this.$errorContenedor.innerText = `Errores: ${this.errores}`;
    }

    contenedorError() {
        this.$errorContenedor.classList.add('error');
        this.incrementadorError();
        this.$tipoMensaje.appendChild(this.$errorContenedor);
    }

    mensajeIntentos() {
        this.$nivelDificultad.classList.add('nivel-dificultad');
        this.$nivelDificultad.innerHTML = `Nivel dificultad: ${this.nivelDificultad}`;
        this.$tipoMensaje.appendChild(this.$nivelDificultad);
    }
}

new Memorama();