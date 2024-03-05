import {tiny, defs} from './examples/common.js';
import {Articulated_Human} from "./human.js";
import {Spline} from "./spline.js";
import {Curve_Shape} from "./shapes.js";

// Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Shape, Material, Shader, Texture, Component } = tiny;

// TODO: you should implement the required classes here or in another file.

export
const Assignment2_base = defs.Assignment2_base =
    class Assignment2_base extends Component
    {                                          
      // **My_Demo_Base** is a Scene that can be added to any display canvas.
      // This particular scene is broken up into two pieces for easier understanding.
      // The piece here is the base class, which sets up the machinery to draw a simple
      // scene demonstrating a few concepts.  A subclass of it, Assignment2,
      // exposes only the display() method, which actually places and draws the shapes,
      // isolating that code so it can be experimented with on its own.
      init()
      {
        console.log("init")

        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape it
        // would be redundant to tell it again.  You should just re-use the
        // one called "box" more than once in display() to draw multiple cubes.
        // Don't define more than one blueprint for the same thing here.
        this.shapes = { 'box'  : new defs.Cube(),
          'ball' : new defs.Subdivision_Sphere( 4 ),
          'axis' : new defs.Axis_Arrows() };

        // *** Materials: ***  A "material" used on individual shapes specifies all fields
        // that a Shader queries to light/color it properly.  Here we use a Phong shader.
        // We can now tweak the scalar coefficients from the Phong lighting formulas.
        // Expected values can be found listed in Phong_Shader::update_GPU().
        const basic = new defs.Basic_Shader();
        const phong = new defs.Phong_Shader();
        const tex_phong = new defs.Textured_Phong();
        this.materials = {};
        this.materials.plastic = { shader: phong, ambient: .2, diffusivity: 1, specularity: .5, color: color( .9,.5,.9,1 ) }
        this.materials.metal   = { shader: phong, ambient: .2, diffusivity: 1, specularity:  1, color: color( .9,.5,.9,1 ) }
        this.materials.rgb = { shader: tex_phong, ambient: .5, texture: new Texture( "assets/rgb.jpg" ) }

        this.ball_location = vec3(1, 1, 1);
        this.ball_radius = 0.25;

        // TODO: you should create a Spline class instance
        this.human = new Articulated_Human();
        this.spline = new Spline();
        this.spline.add_point(3, 7, -0.9, -1, 1, 0);
        this.spline.add_point(2, 8, -0.9, 0, 15, 0);
        this.spline.add_point(3, 9, -0.9, 15, 0, 0);
        this.spline.add_point(4, 8, -0.9, 0, -15, 0);
        this.spline.add_point(3, 7, -0.9, -1, -1, 0);
        this.spline.add_point(2, 6, -0.9, 0, -15, 0);
        this.spline.add_point(3, 5, -0.9, 15, 0, 0);
        this.spline.add_point(4, 6, -0.9, 0, 15, 0);
        this.spline.add_point(3, 7, -0.9, -1, 1, 0);

        const curve_fn = (t) => this.spline.get_position(t);
        this.curve = new Curve_Shape(curve_fn, 1000);

        this.rest_pos = this.human.get_end_effector_position();
        const start_pos = vec3(3, 7, -0.9);
        this.rest_to_start = start_pos.minus(this.rest_pos);
        //const rest_pos = vec3(rest[0], rest[1], rest[2]);

        this.isBegin = true;
        this.isLoop = false;
      }

      render_animation( caller )
      {                                                // display():  Called once per frame of animation.  We'll isolate out
        // the code that actually draws things into Assignment2, a
        // subclass of this Scene.  Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if( !caller.controls )
        { this.animated_children.push( caller.controls = new defs.Movement_Controls( { uniforms: this.uniforms } ) );
          caller.controls.add_mouse_controls( caller.canvas );

          // Define the global camera and projection matrices, which are stored in shared_uniforms.  The camera
          // matrix follows the usual format for transforms, but with opposite values (cameras exist as
          // inverted matrices).  The projection matrix follows an unusual format and determines how depth is
          // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() or
          // orthographic() automatically generate valid matrices for one.  The input arguments of
          // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.

          // !!! Camera changed here
          // TODO: you can change the camera as needed.
          Shader.assign_camera( Mat4.look_at (vec3 (5, 8, 15), vec3 (0, 5, 0), vec3 (0, 1, 0)), this.uniforms );
        }
        this.uniforms.projection_transform = Mat4.perspective( Math.PI/4, caller.width/caller.height, 1, 100 );

        // *** Lights: *** Values of vector or point lights.  They'll be consulted by
        // the shader when coloring shapes.  See Light's class definition for inputs.
        const t = this.t = this.uniforms.animation_time/1000;

        // const light_position = Mat4.rotation( angle,   1,0,0 ).times( vec4( 0,-1,1,0 ) ); !!!
        // !!! Light changed here
        const light_position = vec4(20, 20, 20, 1.0);
        this.uniforms.lights = [ defs.Phong_Shader.light_source( light_position, color( 1,1,1,1 ), 1000000 ) ];

        // draw axis arrows.
        this.shapes.axis.draw(caller, this.uniforms, Mat4.identity(), this.materials.rgb);
      }
    }


export class Assignment2 extends Assignment2_base
{                                                    
  // **Assignment2** is a Scene object that can be added to any display canvas.
  // This particular scene is broken up into two pieces for easier understanding.
  // See the other piece, My_Demo_Base, if you need to see the setup code.
  // The piece here exposes only the display() method, which actually places and draws
  // the shapes.  We isolate that code so it can be experimented with on its own.
  // This gives you a very small code sandbox for editing a simple scene, and for
  // experimenting with matrix transformations.
  render_animation( caller )
  {                                                // display():  Called once per frame of animation.  For each shape that you want to
    // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
    // different matrix value to control where the shape appears.

    // Variables that are in scope for you to use:
    // this.shapes.box:   A vertex array object defining a 2x2x2 cube.
    // this.shapes.ball:  A vertex array object defining a 2x2x2 spherical surface.
    // this.materials.metal:    Selects a shader and draws with a shiny surface.
    // this.materials.plastic:  Selects a shader and draws a more matte surface.
    // this.lights:  A pre-made collection of Light objects.
    // this.hover:  A boolean variable that changes when the user presses a button.
    // shared_uniforms:  Information the shader needs for drawing.  Pass to draw().
    // caller:  Wraps the WebGL rendering context shown onscreen.  Pass to draw().

    // Call the setup code that we left inside the base class:
    super.render_animation( caller );

    /**********************************
     Start coding down here!!!!
     **********************************/
    // From here on down it's just some example shapes drawn for you -- freely
    // replace them with your own!  Notice the usage of the Mat4 functions
    // translation(), scale(), and rotation() to generate matrices, and the
    // function times(), which generates products of matrices.

    const blue = color( 0,0,1,1 ), yellow = color( 1,0.7,0,1 ), 
          wall_color = color( 0.7, 1.0, 0.8, 1 ), 
          blackboard_color = color( 0.2, 0.2, 0.2, 1 );

    const t = this.t = this.uniforms.animation_time/1000;

    // !!! Draw ground
    let floor_transform = Mat4.translation(0, 0, 0).times(Mat4.scale(10, 0.01, 10));
    this.shapes.box.draw( caller, this.uniforms, floor_transform, { ...this.materials.plastic, color: yellow } );

    // TODO: you should draw scene here.
    // TODO: you can change the wall and board as needed.
    let wall_transform = Mat4.translation(0, 5, -1.2).times(Mat4.scale(6, 5, 0.1));
    this.shapes.box.draw( caller, this.uniforms, wall_transform, { ...this.materials.plastic, color: wall_color } );
    let board_transform = Mat4.translation(3, 7, -1).times(Mat4.scale(2.5, 2.5, 0.1));
    this.shapes.box.draw( caller, this.uniforms, board_transform, { ...this.materials.plastic, color: blackboard_color } );

    const t_1 = t % 1;
    if (t > 1) {
      this.isBegin = false;
      this.isLoop = true;
    }
    if (this.isBegin) {
      const p = this.rest_pos.plus(this.rest_to_start.times(t_1));
      const end_pos = [p[0], p[1], p[2]];
      this.human.ik_solver(end_pos, 0.4);
      this.human.draw( caller, this.uniforms, this.materials.plastic);
    }
    if (this.isLoop) {
      const t_2 = ((t - 1) / 4.0) % 1;
      const p = this.spline.get_position(this.spline.get_u(this.spline.constant_vel_fn(t_2)));
      const end_pos = [p[0], p[1], p[2]];
      this.human.ik_solver(end_pos, 0.4);
      this.human.draw( caller, this.uniforms, this.materials.plastic);
    }

    this.curve.draw(caller, this.uniforms);
    //const x = this.spline.get_u(6.7);
    //console.log(this.spline.get_length(1));

    //console.log(this.spline.constant_vel_fn(t_1));
    //console.log(this.spline.get_u(this.spline.constant_vel_fn(t_1)));
    //let s = this.spline.get_position(t_1);
    // let s = this.spline.get_position(this.spline.get_u(this.spline.constant_vel_fn(t_1)));
    // let ball_transform = Mat4.translation(s[0], s[1], s[2]).times(Mat4.scale(0.2, 0.2, 0.2));
    // this.shapes.ball.draw( caller, this.uniforms, ball_transform, { ...this.materials.plastic, color: yellow } );
  }

  render_controls()
  {                                 
    // render_controls(): Sets up a panel of interactive HTML elements, including
    // buttons with key bindings for affecting this scene, and live info readouts.
    this.control_panel.innerHTML += "Assignment 2: IK Engine";
    this.new_line();    
    // TODO: You can add your button events for debugging. (optional)
    this.key_triggered_button( "Debug", [ "Shift", "D" ], this.debug );
    this.key_triggered_button( "Debug 2", [ "Shift", "E" ], this.debug2 );
    this.new_line();
  }

  debug() {
    this.human.debug();
    console.log("Current end effector at ", this.human.get_end_effector_position());
  }

  debug2() {
    this.human.debug(null, 2);
    console.log("Current end effector at ", this.human.get_end_effector_position());
  }
}
