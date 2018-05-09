var Piezas = function(_xActual,_yActual,_xOriginal,_yOriginal,alto,ancho){
  this.xActual = _xActual;
  this.yActual= _yActual;
  this.xOriginal=_xOriginal;
  this.yOriginal=_yOriginal;
  this.anchoPiezas = ancho;
  this.altoPiezas = alto;
};

var Juego =  {
  grilla: [[1, 2, 3],[4, 5, 6],[7, 8, 9]],
  grillaCorrecta: [[1, 2, 3],[4, 5, 6],[7, 8, 9]],
  filaVacia: 2,
  columnaVacia: 2,
  cantidadDePiezasPorLado: 3,
  gano: false,
  piezas: [Piezas],
  anchoDeRompecabezas:0,
  altoDeRompecabezas:0,
  canvas: undefined,
  contexto: undefined,
  contadorDeMovimientos: document.getElementById("contadorDeMovimientos"),
  imagen: undefined,
  anchoPiezas: undefined,
  altoPiezas: undefined,

  estaEnPosicion: function(i,j){
    return this.grilla[i][j] == this.grillaCorrecta[i][j];
  },

  crearGrilla: function(){
    Juego.grilla = [];
    var nro_inicial = 1;
    for(var i = 0; i < Juego.cantidadDePiezasPorLado; i++){
      var grilla_parcial = [];
      for(var j = 0; j < Juego.cantidadDePiezasPorLado; j++){
        grilla_parcial[j] = nro_inicial;
        nro_inicial++;
      }
      Juego.grilla[i] = grilla_parcial;
    }
  },

  tienenSuPosicionOriginal: function(elemento,indice,arreglo){
    return elemento.xActual == elemento.xOriginal && elemento.yActual == elemento.yOriginal
  },

  chequeoVictoria: function(){
    return Juego.piezas.every(Juego.tienenSuPosicionOriginal)
  },

  mostrarCartelGanador: function(){
//    alert("Ganaste! Lograste armar el rompecabezas!");
    swal({title: "Felicitaciones!",
          text: "Completaste el rompecabezas!",
          icon: "success",
          button: "Aceptar",
        });
  },

  intercambioVariablesGrilla: function(filaPos1, columnaPos1, filaPos2, columnaPos2){
    var posicionAnterior = Juego.grilla[filaPos1][columnaPos1];
    Juego.grilla[filaPos1][columnaPos1] = Juego.grilla[filaPos2][columnaPos2];
    Juego.grilla[filaPos2][columnaPos2] = posicionAnterior;
  },

  intercambioVariablesPiezas: function(filaPos1,columnaPos1,filaPos2,columnaPos2){
    var posPieza1 = Juego.grilla[filaPos1][columnaPos1] - 1
    var posPieza2 =  Juego.grilla[filaPos2][columnaPos2] - 1
    var pieza1 = Juego.piezas[posPieza1]
    var pieza2 = Juego.piezas[posPieza2]

    var piezaParcial_x = pieza1.xActual
    var piezaParcial_y = pieza1.yActual

    var eliminado = Juego.piezas.splice(posPieza2, 1, pieza2);
    Juego.piezas.splice(posPieza2, 1, eliminado[0]);

    pieza1.xActual = pieza2.xActual
    pieza1.yActual = pieza2.yActual

    pieza2.xActual = piezaParcial_x
    pieza2.yActual = piezaParcial_y
    Juego.actualizarPosicionVacia(filaPos2,columnaPos2)

  },

  dibujarPiezaBlanca: function (piezaBlanca){
    Juego.contexto.lineWidth="4";
    Juego.contexto.fillStyle = '#0F4471';
    Juego.contexto.fillRect(piezaBlanca.xActual,piezaBlanca.yActual,piezaBlanca.anchoPiezas,piezaBlanca.altoPiezas);
  },

  intercambiarPosiciones: function(filaPos1, columnaPos1, filaPos2, columnaPos2){
    Juego.intercambioVariablesGrilla(filaPos1,columnaPos1,filaPos2,columnaPos2);
    var piezaBlanca = Juego.piezas[Juego.grilla[filaPos2][columnaPos2] - 1]
    var piezaADibujar = Juego.piezas[Juego.grilla[filaPos1][columnaPos1] - 1]

    Juego.intercambioVariablesPiezas(filaPos1,columnaPos1,filaPos2,columnaPos2);

    Juego.contexto.drawImage(Juego.imagen, piezaADibujar.xOriginal, piezaADibujar.yOriginal, Juego.anchoPiezas, Juego.altoPiezas, piezaADibujar.xActual, piezaADibujar.yActual, piezaADibujar.anchoPiezas, piezaADibujar.altoPiezas);

    Juego.dibujarPiezaBlanca(piezaBlanca)
  },

  // Actualiza la posición de la pieza vacía
  actualizarPosicionVacia: function(nuevaFila,nuevaColumna){
    Juego.filaVacia = nuevaFila;
    Juego.columnaVacia = nuevaColumna;
  },

  // Para chequear si la posicón está dentro de la grilla.
  posicionValida: function(fila, columna){
    return !Juego.fueraDelRango(fila) && !Juego.fueraDelRango(columna);
  },

  /*como es cuadrada solo me basta con que sea mayor la cantidad de elementos de la lista - 1
  porque empieza en 0 la cuenta del array */
  fueraDelRango: function(celda){
    return celda > (Juego.grilla.length - 1) || celda < 0;
  },

  actualizarContadorMovimientos: function(){
    Juego.contadorDeMovimientos--
    document.getElementById("contadorDeMovimientos").innerHTML = Juego.contadorDeMovimientos;
    if (Juego.contadorDeMovimientos == 0){
      alert("Perdiste te quedaste sin movimientos")
      juego.iniciar(60 + ((Juego.cantidadDePiezasPorLado - 3) * 20));
    }
  },
  /* Movimiento de fichas, en este caso la que se mueve
  es la blanca intercambiando su posición con otro elemento.
  Las direcciones están dadas por números que representa:
  arriba, abajo, izquierda, derecha */
  moverEnDireccion: function(direccion){
    var nuevaFilaPiezaVacia;
    var nuevaColumnaPiezaVacia;
    // Intercambia pieza blanca con la pieza que está arriba suyo
    //Tecla para arriba
    if(direccion == 40){
      nuevaFilaPiezaVacia = Juego.filaVacia - 1;
      nuevaColumnaPiezaVacia = Juego.columnaVacia;
    }
    // Intercambia pieza blanca con la pieza que está abajo suyo
    //tecla abajo
    else if (direccion == 38) {
      nuevaFilaPiezaVacia = Juego.filaVacia + 1;
      nuevaColumnaPiezaVacia = Juego.columnaVacia;
    }
    // Intercambia pieza blanca con la pieza que está a su izq
    else if (direccion == 39) {
      nuevaFilaPiezaVacia = Juego.filaVacia;
      nuevaColumnaPiezaVacia = Juego.columnaVacia - 1;
    }
    // Intercambia pieza blanca con la pieza que está a su der
    else if (direccion == 37) {
      nuevaFilaPiezaVacia = Juego.filaVacia;
      nuevaColumnaPiezaVacia = Juego.columnaVacia + 1;
    }
    /* Se chequea si la nueva posición es válida, si lo es, se intercambia.
     Para que esta parte del código funcione correctamente deberás haber implementado
     las funciones posicionValida, intercambiarPosiciones y actualizarPosicionVacia */
    if (Juego.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)){
      Juego.intercambiarPosiciones(Juego.filaVacia, Juego.columnaVacia,
      nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
      Juego.actualizarContadorMovimientos()
    }
  },

  /* Las funciones que se encuentran a continuación ya están implementadas.
  No hace falta que entiendas exactamente que es lo que hacen, ya que contienen
  temas aún no vistos. De todas formas, cada una de ellas tiene un comentario
  para que sepas que se está haciendo a grandes rasgos. NO LAS MODIFIQUES a menos que
  entiendas perfectamente lo que estás haciendo! */
  /* Función que mezcla las piezas del tablero una cantidad de veces dada.
  Se calcula una posición aleatoria y se mueve en esa dirección. De esta forma
  se mezclará todo el tablero. */

  mezclarPiezas: function(veces){
    if(veces<=0){return;}
    var direcciones = [40, 38, 39, 37];
    var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
    Juego.moverEnDireccion(direccion);

    setTimeout(function(){
      Juego.mezclarPiezas(veces-1);
    },100);
  },

  /* capturarTeclas: Esta función captura las teclas presionadas por el usuario. Javascript
  permite detectar eventos, por ejemplo, cuando una tecla es presionada y en
  base a eso hacer algo. No es necesario que entiendas como funciona esto ahora,
  en el futuro ya lo vas a aprender. Por ahora, sólo hay que entender que cuando
  se toca una tecla se hace algo en respuesta, en este caso, un movimiento */
  capturarTeclas: function(){
    document.body.onkeydown = (function(evento) {
      if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
        Juego.moverEnDireccion(evento.which);
        var gano = Juego.chequeoVictoria();
        if(gano){
          setTimeout(function(){
            Juego.mostrarCartelGanador();
          },500);
        }
        evento.preventDefault();
      }
    })
  },

  configurarCanvas: function(){
    Juego.canvas = document.getElementById("miCanvas");
    Juego.contexto = Juego.canvas.getContext("2d");
    Juego.contexto.drawImage(Juego.imagen,0,0);
  },

  //FUNCIONES DADAS POR ACAMICA
  cargarImagen: function (e) {
      //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600).
      Juego.anchoPiezas = Math.floor(600 / Juego.cantidadDePiezasPorLado);
      Juego.altoPiezas = Math.floor(600 / Juego.cantidadDePiezasPorLado);
      //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
      Juego.anchoDeRompecabezas = Piezas.anchoPiezas * Juego.cantidadDePiezasPorLado;
      Juego.altoDeRompecabezas = Piezas.altoPiezas * Juego.cantidadDePiezasPorLado;
      Juego.configurarCanvas();
    },

    //funcion que carga la imagen
    iniciarImagen: function (callback) {
      Juego.imagen = new Image();
      var self = Juego;
      //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
      Juego.imagen.addEventListener('load', function () {
        self.cargarImagen.call(self);
        callback();
      }, false);
      Juego.imagen.src = "images/imagen.jpg";
    },

    construirPiezas: function() {
      for(var i = 0; i < Juego.cantidadDePiezasPorLado; i++){
        for(var j = 0; j < Juego.cantidadDePiezasPorLado; j++){
          Juego.piezas.push(new Piezas(0 + j * Juego.anchoPiezas,
                                        0 + i * Juego.altoPiezas,
                                        0 + j * Juego.anchoPiezas,
                                        0 + i * Juego.altoPiezas,
                                        Juego.altoPiezas,Juego.anchoPiezas));
        }
      }
      var piezaBlanca = Juego.piezas[Juego.grilla[Juego.filaVacia][Juego.columnaVacia] - 1]
      Juego.dibujarPiezaBlanca(piezaBlanca)
    },

    //una vez elegido el nivel, se inicia el juego
    iniciar: function (cantMovimientos) {
      Juego.movimientosTotales = cantMovimientos;
      Juego.contadorDeMovimientos = cantMovimientos;
      Juego.piezas = [];
      Juego.grilla = [];
      document.getElementById("contadorDeMovimientos").innerHTML = Juego.contadorDeMovimientos;
      Juego.cantidadDePiezasPorLado = parseInt(document.getElementById("cantidad_piezas").innerHTML);
      //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
      var self = Juego;
      Juego.crearGrilla();
      //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
      Juego.filaPosicionVacia = Juego.cantidadDePiezasPorLado - 1;
      Juego.columnaPosicionVacia = Juego.cantidadDePiezasPorLado - 1;
      //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
      Juego.iniciarImagen(function () {
        self.construirPiezas();
        //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
        var cantidadDeMezclas = Math.max(Math.pow(Juego.cantidadDePiezasPorLado, 3), 100);
        self.mezclarPiezas(10);
      });
    }

}

$('#restar_pieza').click(function(){
  Juego.cantidadDePiezasPorLado--;
  modificar_cant_pieza(Juego.cantidadDePiezasPorLado);
  Juego.iniciar(Juego.contadorDeMovimientos - 20);
});

$('#sumar_pieza').click(function(){
  Juego.cantidadDePiezasPorLado++;
  modificar_cant_pieza(Juego.cantidadDePiezasPorLado);
  Juego.iniciar(Juego.contadorDeMovimientos + 20);
});

$('#mezclar').click(function(){
  Juego.iniciar(60)
});

$('#miCanvas').click(function(e){
  obtenerPosicion(e)
})
function obtenerPosicion(event){
  var rect = Juego.canvas.getBoundingClientRect();
  var x = event.clientX - rect.left,
      y = event.clientY - rect.top
  var piezaVacia = Juego.piezas[Juego.grilla[Juego.filaVacia][Juego.columnaVacia] - 1]
  var minX=piezaVacia.xActual - piezaVacia.anchoPiezas,
      maxX=piezaVacia.xActual,
      minY=piezaVacia.yActual,
      maxY=piezaVacia.yActual + piezaVacia.altoPiezas
  if(between(minX,maxX,x) && between(minY,maxY,y)){
    Juego.moverEnDireccion(39) //derecha
    var gano = Juego.chequeoVictoria();
    if(gano){
      setTimeout(function(){
        Juego.mostrarCartelGanador();
      },500);
    }
  }
  minX = piezaVacia.xActual + piezaVacia.anchoPiezas
  maxX = minX +  piezaVacia.anchoPiezas
  if(between(minX,maxX,x) && between(minY,maxY,y)){
    Juego.moverEnDireccion(37)//izquierda
    var gano = Juego.chequeoVictoria();
    if(gano){
      setTimeout(function(){
        Juego.mostrarCartelGanador();
      },500);
    }
  }
  minX= piezaVacia.xActual
  maxX= minX + piezaVacia.anchoPiezas
  minY= piezaVacia.yActual - piezaVacia.altoPiezas
  maxY= minY + piezaVacia.altoPiezas
  if(between(minX,maxX,x) && between(minY,maxY,y)){
    Juego.moverEnDireccion(40)//abajo
    var gano = Juego.chequeoVictoria();
    if(gano){
      setTimeout(function(){
        Juego.mostrarCartelGanador();
      },500);
    }
  }
  minX= piezaVacia.xActual
  maxX= minX + piezaVacia.anchoPiezas
  minY= piezaVacia.yActual + piezaVacia.altoPiezas
  maxY= minY + piezaVacia.altoPiezas
  if(between(minX,maxX,x) && between(minY,maxY,y)){
    Juego.moverEnDireccion(38)//arriba
    var gano = Juego.chequeoVictoria();
    if(gano){
      setTimeout(function(){
        Juego.mostrarCartelGanador();
      },500);
    }
  }
}
function between(min,max,numero){
  return numero >= min && numero <= max
}
function modificar_cant_pieza(cantidad){
  if(cantidad < 2){
    Juego.cantidadDePiezasPorLado++;
    alert("No se puede tener un numero de piezas por lado menor a 2");
  }else {
    document.getElementById("cantidad_piezas").innerHTML= cantidad;
  }
};

var juego = Juego;
juego.iniciar(60);
juego.capturarTeclas();
