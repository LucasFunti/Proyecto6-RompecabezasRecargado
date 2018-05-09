var expect = chai.expect;

describe('Creación', function() {
    'use strict';

describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{
        done();
      }
    });
});

describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      Juego.cantidadDePiezasPorLado = 5;
      Juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
      expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
    });
  });

describe('Posicion correcta', function(){

  it('Movimientos validos', function(){
    Juego.cantidadDePiezasPorLado = 3
    Juego.crearGrilla()
    expect(Juego.posicionValida(2,2)).to.equal(true)
  });

  it('Movimientos invalidos',function(){
    expect(Juego.posicionValida(2,3)).to.equal(false)
    expect(Juego.posicionValida(3,2)).to.equal(false)
  });
});

//intercambiarPosiciones: function(filaPos1, columnaPos1, filaPos2, columnaPos2){
describe('Intercambio de Posiciones',function(){
  Juego.cantidadDePiezasPorLado = 3
  Juego.crearGrilla()
  Juego.iniciar(50)
  var grillaAntesDeCambiar = Juego.grilla
  console.log(grillaAntesDeCambiar)

  it ('Intercambio variables Grilla',function(){

    Juego.intercambioVariablesGrilla(2,2,1,2)

    console.log(Juego.grilla)
    expect(Juego.grilla != grillaAntesDeCambiar).to.equal(true)
  })

   it('Intercambio valido',function(){
     expect(Juego.intercambiarPosiciones(2,2,1,2)).to.equal(true)
   })
})

});
