const celd = [];
const RCTC = 5; //Reticula
let alto;
let ancho;

const azulejos = [];
const numAzulejos = 17; //Numero de azulejos(imagenes)
const reglas = [//Reglas bordes para cada azulejo
  {//tile 0
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0,
  },
  {//tile 1
    UP: 1,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 1,
  },
  {//tile 2
    UP: 1,
    RIGHT: 1,
    DOWN: 0,
    LEFT: 0,
  },
  {//tile 3
    UP: 0,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 0,
  },
  {//tile 4
    UP: 0,
    RIGHT: 0,
    DOWN: 1,
    LEFT: 1,
  },
  {//tile 5
    UP: 1,
    RIGHT: 0,
    DOWN: 1,
    LEFT: 1,
  },
  {//tile 6
    UP: 1,
    RIGHT: 1,
    DOWN: 0,
    LEFT: 1,
  },
  {//tile 7
    UP: 1,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 0,
  },
  {//tile 8
    UP: 0,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 1,
  },
  {//tile 9
    UP: 0,
    RIGHT: 1,
    DOWN: 0,
    LEFT: 1,
  },
  {//tile 10
    UP: 1,
    RIGHT: 0,
    DOWN: 1,
    LEFT: 0,
  },
  {//tile 11
    UP: 1,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0,
  },
  {//tile 12
    UP: 0,
    RIGHT: 1,
    DOWN: 0,
    LEFT: 0,
  },
  {//tile 13
    UP: 0,
    RIGHT: 0,
    DOWN: 1,
    LEFT: 0,
  },
  {//tile 14
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 1,
  },
  {//tile 15
    UP: 1,
    RIGHT: 1,
    DOWN: 1,
    LEFT: 1,
  },
  {//tile 16
    UP: 0,
    RIGHT: 0,
    DOWN: 0,
    LEFT: 0,
  },
];

function preload(){
  for (let i = 0; i < numAzulejos; i++) {
    azulejos[i] = loadImage('azulejos/tile'+i+'.png');
  }
}


function setup() {
  createCanvas(1080, 1080);

  ancho = width / RCTC;
  alto = height / RCTC;
    
  let opciInc = [];
  for (let i = 0; i < azulejos.length; i++) {
    opciInc.push(i);
  }

  for (let i = 0; i < RCTC * RCTC; i++) {
    celd[i] = {
      colapse: false,
      opci: opciInc,
    };
  }
}


function draw() {
  const celdaDisponible = celd.filter((celda) => celda.colapse == false);

  if (celdaDisponible.length > 0) {
    
    celdaDisponible.sort((a,b)=> {
      return a.opci.length - b.opci.length;
    });

    const celdColapse = celdaDisponible.filter((celda)=>{
      return celda.opci.length == celdaDisponible[0].opci.length;
    });

    const celdaSeleccionada = random(celdColapse);
    celdaSeleccionada.colapse = true;

    const opcSelec = random (celdaSeleccionada.opci);
    celdaSeleccionada.opci = [opcSelec];    
    
    for (let x = 0; x < RCTC; x++) {
      for (let y = 0; y < RCTC; y++) {
        const cldIndex = x + y * RCTC;
        const celdaActual = celd[cldIndex];
        if (celdaActual.colapse) {
          
          const indAzulejo = celdaActual.opci[0];
          const ruleAct = reglas[indAzulejo];

          image(
            azulejos[indAzulejo], 
            x * ancho, 
            y * alto,
            ancho,
            alto
            );

            //Check UP
            if(y > 0){
              const indUP = x + (y - 1) *RCTC;
              const celdUP = celd[indUP];
              if (!celdUP.colapse) {
                cambiarEntropia(
                  celdUP, 
                  ruleAct['UP'], 
                  'DOWN'
                );
              }
            }
            //Check RIGHT
            if(x < RCTC - 1){
              const indRIGHT = (x + 1) + y  *RCTC;
              const celdRIGHT = celd[indRIGHT];
              if (!celdRIGHT.colapse) {
                cambiarEntropia(
                  celdRIGHT, 
                  ruleAct['RIGHT'], 
                  'LEFT'
                );
              }
            }
            //Check DOWN
            if(y < RCTC - 1){
              const indDOWN = x + (y + 1) *RCTC;
              const celdDOWN = celd[indDOWN];
              if (!celdDOWN.colapse) {
                cambiarEntropia(
                  celdDOWN, 
                  ruleAct['DOWN'], 
                  'UP'
                );
              }
            }
            //Check LEFT
            if(x > 0){
              const indLEFT = (x -1) + y  *RCTC;
              const celdLEFT = celd[indLEFT];
              if (!celdLEFT.colapse) {
                cambiarEntropia(
                  celdLEFT, 
                  ruleAct['LEFT'], 
                  'RIGHT'
                );
              }
            }
        } else {          
          //Draw reticula
          strokeWeight(1);
          rect(x * ancho, y * alto, ancho, alto);          
        }
      }
    }
  }
}

function cambiarEntropia(_celda, _rule, _ops){
  const nuevasOpciones = [];
  for (let i = 0; i < _celda.opci.length; i++) {
    if(_rule == reglas[_celda.opci[i]][_ops]){                    
      const celdaCompatible = _celda.opci[i];
      nuevasOpciones.push(celdaCompatible);
    }
  }
  _celda.opci = nuevasOpciones;
}
