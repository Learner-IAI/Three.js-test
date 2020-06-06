varying vec2 TexCoord;

uniform float Time;

/* Main vertex shader function */
void main( void )
{
  TexCoord = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
} /* End of 'main' function */
