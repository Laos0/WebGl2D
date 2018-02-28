import Point from './objects/Point'

import Shape from './objects/Shape'

 

// Created 4 different type of matrices

export function makeIdentityMatrix(){

    var myMatrix = [1,0,0,

                    0,1,0,

                    0,0,1

    ]

 

    return myMatrix;

}

 

//[1,0,tx,

//0,1,ty,

//0,0,1];

 

export function makeTranslationMatrix(tx, ty){

    var myMatrix = makeIdentityMatrix();

 

    myMatrix[6] = tx;

    myMatrix[7] = ty;

 

    return myMatrix;

}

 

export function makeScaleMatrix(sx,sy){

  var myMatrix = makeIdentityMatrix();

 

  myMatrix[0] = sx;

  myMatrix[4] = sy;

 

  return myMatrix;

}

 

export function makeRotationMatrix(thetaInDegrees){

  var myMatrix = makeIdentityMatrix();

 

  let thetaInRadians = thetaInDegrees / 180.0 * Math.PI

  myMatrix[0] = Math.cos(thetaInRadians);

  myMatrix[1] = Math.sin(thetaInRadians);

  myMatrix[3] = -(Math.sin(thetaInRadians));

  myMatrix[4] = Math.cos(thetaInRadians);

 

  return myMatrix;

}

 

 

// Function that multiply two matrices in col-major

export function multiplyMatrices(M1,M2){

  let M3 = [0,0,0,

            0,0,0,

            0,0,0

  ];

 

  M3[0] = ((M1[0]*M2[0]) + (M1[3]*M2[1]) + (M1[6]*M2[2]));

  M3[1] = ((M1[1]*M2[0]) + (M1[4]*M2[1]) + (M1[7]*M2[2]));

  M3[2] = ((M1[2]*M2[0]) + (M1[5]*M2[1]) + (M1[8]*M2[2]));

 

  M3[3] = ((M1[0]*M2[3]) + (M1[3]*M2[4]) + (M1[6]*M2[5]));

  M3[4] = ((M1[1]*M2[3]) + (M1[4]*M2[4]) + (M1[7]*M2[5]));

  M3[5] = ((M1[2]*M2[3]) + (M1[5]*M2[4]) + (M1[8]*M2[5]));

 

  M3[6] = ((M1[0]*M2[6]) + (M1[3]*M2[7]) + (M1[6]*M2[8]));

  M3[7] = ((M1[1]*M2[6]) + (M1[4]*M2[7]) + (M1[7]*M2[8]));

  M3[8] = ((M1[2]*M2[6]) + (M1[5]*M2[7]) + (M1[8]*M2[8]));

 

 

  return M3;

}

// TODO: Provide a function to transform a point by a matrix

//   - transformPoint (P, M)

// DO NOT MODIFY P! Instead, just use the values of P and the matrix

// to construct a brand new Point object. The math is simple matrix-

// vector multiplication. Return the new/transformed point.

// NOTE: You will likely need to import the Point object at the

//       top of the file (see Shape.js for an example of this)

 

export function transformPoint (P, M) {

 

  let x = ((M[0] * P.x) + (M[3] * P.y) + (M[6] * 1))

  let y = ((M[1] * P.x) + (M[4] * P.y) + (M[7] * 1))

 

  let myPoint = new Point(x, y)

  // Return matrix

  return myPoint

}

// TODO: Provide a function to build the composite transformation

//       for a given shape object.

//   - rebuildTransformationMatrix (shape)

// The 'shape' passed to this function will have the following props:

//   - shape.tx & shape.ty for translation properties

//   - shape.sx & shape.sy for scale properties

//   - shape.rotAngle & shape.rotAroundCenter for rotation properties

// Compute the full transformation matrix taking those properties

// into account and store it on the 'shape' object as 'shape.M'

// NOTE: Keep the following in mind

//   - All shapes have a function computeCentroid()

//   - Scaling should ALWAYS happen around the shape center

//   - Rotation is around the origin UNLESS shape.rotAroundCenter is true

//   - The order in which you combine the transformations is VERY important

 

export function rebuildTransformationMatrix(shape){

  // Temp matrix

  var compositeMatrix = null;

 

  var center = shape.computeCentroid();                       // get the center of the shape

  var toOrigin = makeTranslationMatrix(-center.x, -center.y); // translate the shape to the origin

  var fromOrigin = makeTranslationMatrix(center.x, center.y); // Bring the shape back to its center

 

 

  var translationMatrix = makeTranslationMatrix(shape.tx,shape.ty);

  // compositeMatrix = translationMatrix;

 

  // scale matrix

  var scaleMatrix = makeScaleMatrix(shape.sx, shape.sy); // make scale matrix

  scaleMatrix = multiplyMatrices(scaleMatrix,toOrigin); // Expanding shape at origin location

  scaleMatrix = multiplyMatrices(fromOrigin,scaleMatrix); // Translating the shape back to its original position

// scaleMatrix = multiplyMatrices(fromOrigin,scaleMatrix);

 

 

  // rotatation matrix

  var rotationMatrix = null;

 

  if(shape.rotAroundCenter == true){

     

 

    rotationMatrix = makeRotationMatrix(shape.rotAngle); // get the rotation matrix

    rotationMatrix = multiplyMatrices(rotationMatrix,toOrigin); // rotate the shape on the origin

    rotationMatrix = multiplyMatrices(fromOrigin,rotationMatrix) // moves shape back where it was created

   

    

  }else{

    rotationMatrix = makeRotationMatrix(shape.rotAngle); // get the rotation matrix

   

  }

 

   // Formula shape.M = T * R * S

   compositeMatrix = multiplyMatrices(translationMatrix,rotationMatrix);

   compositeMatrix = multiplyMatrices(compositeMatrix, scaleMatrix);

   shape.M = compositeMatrix;

  

}

 

/**

* Generate an orthographic projeciton matrix (2D or 3D) for use

* in defining the cannonical viewing volume for the current scene.

* Can be used as a projection matrix in a shader.

* @param {number} b The location of the BOTTOM of the view volume

* @param {number} t The location of the TOP of the view volume

* @param {number} l The location of the LEFT of the view volume

* @param {number} r The location of the RIGHT of the view volume

* @param {number} n The location of the NEAR face of the view

*                   volume (optional, defaults to -1)

* @param {number} f The location of the FAR face of the view

*                   volume (optional, defaults to 1)

*/

export function orthoMatrix (b, t, l, r, n = -1.0, f = 1.0) {

  // Pre-compute matrix values

  var A1 = 2 / (r - l)

  var B1 = 2 / (t - b)

  var C1 = -2 / (f - n)

  var A2 = -(r + l) / (r - l)

  var B2 = -(t + b) / (t - b)

  var C2 = -(f + n) / (f - n)

 

  // Build orthographic projection matrix in col-major order

  var M = [

    A1, 0, 0, 0,

    0, B1, 0, 0,

    0, 0, C1, 0,

    A2, B2, C2, 1

  ]

 

  // Return matrix

  return M

}
