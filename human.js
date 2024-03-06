import {tiny, defs} from './examples/common.js';


// Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Shape, Material, Shader, Texture, Component } = tiny;

const shapes = {
    'sphere': new defs.Subdivision_Sphere( 5 ),
};

export
const Articulated_Human =  // from discussion slides
class Articulated_Human {
    constructor() {
        const sphere_shape = shapes.sphere;

        // torso node
        const torso_transform = Mat4.scale(0.9, 1.7, 0.5);
        this.torso_node = new Node("torso", sphere_shape, torso_transform);
        // root->torso
        const root_location = Mat4.translation(0, 6, 0);
        this.root = new Arc("root", null, this.torso_node, root_location);
        this.root.set_dof(true, true, true, false, false, false);

        // head node
        let head_transform = Mat4.scale(.6, .6, .6);
        head_transform.pre_multiply(Mat4.translation(0, .6, 0));
        this.head_node = new Node("head", sphere_shape, head_transform);
        // torso->neck->head
        const neck_location = Mat4.translation(0, 1.7, 0);
        this.neck = new Arc("neck", this.torso_node, this.head_node, neck_location);
        this.torso_node.children_arcs.push(this.neck);

        // right upper arm node
        let ru_arm_transform = Mat4.scale(1, .2, .2);
        ru_arm_transform.pre_multiply(Mat4.translation(1, 0, 0));
        this.ru_arm_node = new Node("ru_arm", sphere_shape, ru_arm_transform);
        // torso->r_shoulder->ru_arm
        const r_shoulder_location = Mat4.translation(0.4, 1.5, 0);
        this.r_shoulder = new Arc("r_shoulder", this.torso_node, this.ru_arm_node, r_shoulder_location);
        this.torso_node.children_arcs.push(this.r_shoulder)
        this.r_shoulder.set_dof(false, false, false, true, true, true);

        // right lower arm node
        let rl_arm_transform = Mat4.scale(0.8, .2, .2);
        rl_arm_transform.pre_multiply(Mat4.translation(0.8, 0, 0));
        this.rl_arm_node = new Node("rl_arm", sphere_shape, rl_arm_transform);
        // ru_arm->r_elbow->rl_arm
        const r_elbow_location = Mat4.translation(2, 0, 0);
        this.r_elbow = new Arc("r_elbow", this.ru_arm_node, this.rl_arm_node, r_elbow_location);
        this.ru_arm_node.children_arcs.push(this.r_elbow)
        this.r_elbow.set_dof(false, false, false, true, true, false);

        // right hand node
        let r_hand_transform = Mat4.scale(.4, .3, .2);
        r_hand_transform.pre_multiply(Mat4.translation(0.4, 0, 0));
        this.r_hand_node = new Node("r_hand", sphere_shape, r_hand_transform);
        // rl_arm->r_wrist->r_hand
        const r_wrist_location = Mat4.translation(1.6, 0, 0);
        this.r_wrist = new Arc("r_wrist", this.rl_arm_node, this.r_hand_node, r_wrist_location);
        this.rl_arm_node.children_arcs.push(this.r_wrist)
        this.r_wrist.set_dof(false, false, false, false, true, true);

        // left upper arm node
        let lu_arm_transform = Mat4.scale(1, .2, .2);
        lu_arm_transform.pre_multiply(Mat4.translation(-1, 0, 0));
        this.lu_arm_node = new Node("lu_arm", sphere_shape, lu_arm_transform);
        // torso->l_shoulder->lu_arm
        const l_shoulder_location = Mat4.translation(-0.4, 1.5, 0);
        this.l_shoulder = new Arc("l_shoulder", this.torso_node, this.lu_arm_node, l_shoulder_location);
        this.torso_node.children_arcs.push(this.l_shoulder)

        // left lower arm node
        let ll_arm_transform = Mat4.scale(0.8, .2, .2);
        ll_arm_transform.pre_multiply(Mat4.translation(-0.8, 0, 0));
        this.ll_arm_node = new Node("ll_arm", sphere_shape, ll_arm_transform);
        // lu_arm->l_elbow->ll_arm
        const l_elbow_location = Mat4.translation(-2, 0, 0);
        this.l_elbow = new Arc("l_elbow", this.lu_arm_node, this.ll_arm_node, l_elbow_location);
        this.lu_arm_node.children_arcs.push(this.l_elbow)

        // left hand node
        let l_hand_transform = Mat4.scale(.4, .3, .2);
        l_hand_transform.pre_multiply(Mat4.translation(-0.4, 0, 0));
        this.l_hand_node = new Node("l_hand", sphere_shape, l_hand_transform);
        // ll_arm->l_wrist->l_hand
        const l_wrist_location = Mat4.translation(-1.6, 0, 0);
        this.l_wrist = new Arc("l_wrist", this.ll_arm_node, this.l_hand_node, l_wrist_location);
        this.ll_arm_node.children_arcs.push(this.l_wrist);

        // right thigh node
        let r_thigh_transform = Mat4.scale(.3, 1.1, .4);
        r_thigh_transform.pre_multiply(Mat4.translation(0, -1.1, 0));
        this.r_thigh_node = new Node("r_thigh", sphere_shape, r_thigh_transform);
        // torso->r_hip->r_thigh
        const r_hip_location = Mat4.translation(0.4, -1.5, 0);
        this.r_hip = new Arc("r_hip", this.torso_node, this.r_thigh_node, r_hip_location);
        this.torso_node.children_arcs.push(this.r_hip)

        // right shin node
        let r_shin_transform = Mat4.scale(0.3, 1, .3);
        r_shin_transform.pre_multiply(Mat4.translation(0, -1, 0));
        this.r_shin_node = new Node("r_shin", sphere_shape, r_shin_transform);
        // r_thigh->r_knee->r_shin
        const r_knee_location = Mat4.translation(0, -2.2, 0);
        this.r_knee = new Arc("r_knee", this.r_thigh_node, this.r_shin_node, r_knee_location);
        this.r_thigh_node.children_arcs.push(this.r_knee)

        // right foot node
        let r_foot_transform = Mat4.scale(.3, .15, .3);
        r_foot_transform.pre_multiply(Mat4.translation(0, -0.15, 0));
        this.r_foot_node = new Node("r_foot", sphere_shape, r_foot_transform);
        // r_shin->r_ankle->r_foot
        const r_ankle_location = Mat4.translation(0, -2, 0);
        this.r_ankle = new Arc("r_ankle", this.r_shin_node, this.r_foot_node, r_ankle_location);
        this.r_shin_node.children_arcs.push(this.r_ankle)

        // left thigh node
        let l_thigh_transform = Mat4.scale(-.3, 1.1, .4);
        l_thigh_transform.pre_multiply(Mat4.translation(0, -1.1, 0));
        this.l_thigh_node = new Node("l_thigh", sphere_shape, l_thigh_transform);
        // torso->l_hip->l_thigh
        const l_hip_location = Mat4.translation(-0.4, -1.5, 0);
        this.l_hip = new Arc("l_hip", this.torso_node, this.l_thigh_node, l_hip_location);
        this.torso_node.children_arcs.push(this.l_hip)

        // left shin node
        let l_shin_transform = Mat4.scale(0.3, 1, .3);
        l_shin_transform.pre_multiply(Mat4.translation(0, -1, 0));
        this.l_shin_node = new Node("l_shin", sphere_shape, l_shin_transform);
        // l_thigh->l_knee->l_shin
        const l_knee_location = Mat4.translation(0, -2.2, 0);
        this.l_knee = new Arc("l_knee", this.l_thigh_node, this.l_shin_node, l_knee_location);
        this.l_thigh_node.children_arcs.push(this.l_knee)

        // left foot node
        let l_foot_transform = Mat4.scale(.3, .15, .3);
        l_foot_transform.pre_multiply(Mat4.translation(0, -0.15, 0));
        this.l_foot_node = new Node("l_foot", sphere_shape, l_foot_transform);
        // l_shin->l_ankle->l_foot
        const l_ankle_location = Mat4.translation(0, -2, 0);
        this.l_ankle = new Arc("l_ankle", this.l_shin_node, this.l_foot_node, l_ankle_location);
        this.l_shin_node.children_arcs.push(this.l_ankle)

        const r_hand_end_local_pos = vec4(0.8, 0, 0, 1);
        this.end_effector = new End_Effector("right_hand", this.r_wrist, r_hand_end_local_pos);
        this.r_wrist.end_effector = this.end_effector;

        this.dof = 10;
        this.theta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.apply_theta();
    }

    ik_solver(final_pos, epsilon) {
        let E = [0, 0, 0];
        const p = this.get_end_effector_position();
        let p_arr = [p[0], p[1], p[2]];
        const k = 0.1;

        do { // algorithm given in lecture slides
            E = math.subtract(final_pos, p_arr);
            const delta_p = math.multiply(k, E);
            const J = this.calculate_Jacobian();
            const delta_theta = this.calculate_delta_theta(J, delta_p);
            this.theta = this.theta.map((v, i) => v + delta_theta[i][0]);
            this.check_constraints(); // make sure joints not rotating past their constraints
            this.apply_theta();
            p_arr = math.add(p_arr, delta_p);
        }
        while (math.norm(E, 3) > epsilon)
    }

    check_constraints() { // constraints on how much joints can rotate
        if (this.theta[0] < (-1))
            this.theta[0] = -1;
        else if (this.theta[0] > (1))
            this.theta[0] = 1;
        if (this.theta[1] !== 0) // so person doesn't levitate or go into ground
            this.theta[1] = 0;
        if (this.theta[2] < (-0.8))
            this.theta[2] = -0.8;
        if (this.theta[4] < (-Math.PI / 2))
            this.theta[4] = -Math.PI / 2;
        else if (this.theta[4] > (Math.PI / 2))
            this.theta[4] = Math.PI / 2;
        if (this.theta[5] < (-Math.PI / 2))
            this.theta[5] = -Math.PI / 2;
        else if (this.theta[5] > (Math.PI / 2))
            this.theta[5] = Math.PI / 2;
        if (this.theta[6] < (-Math.PI / 2))
            this.theta[6] = -Math.PI / 2;
        else if (this.theta[6] > (Math.PI / 2))
            this.theta[6] = Math.PI / 2;
        if (this.theta[7] > (Math.PI))
            this.theta[7] = Math.PI;
        else if (this.theta[7] < 0)
            this.theta[7] = 0;
        if (this.theta[8] < (-Math.PI / 2))
            this.theta[8] = -Math.PI / 2;
        else if (this.theta[8] > (Math.PI / 2))
            this.theta[8] = Math.PI / 2;
        if (this.theta[9] < (-Math.PI / 4))
            this.theta[9] = -Math.PI / 4;
        else if (this.theta[9] > (Math.PI / 4))
            this.theta[9] = Math.PI / 4;
    }

    apply_theta() {
        this.root.update_articulation(this.theta.slice(0, 3));
        this.r_shoulder.update_articulation(this.theta.slice(3, 6));
        this.r_elbow.update_articulation(this.theta.slice(6, 8));
        this.r_wrist.update_articulation(this.theta.slice(8, 10));
    }

    calculate_Jacobian() {
        let J = new Array(3);
        for (let i = 0; i < 3; i++) {
            J[i] = new Array(this.dof);
        }

        const p = this.get_end_effector_position();
        const step = 0.01;

        for (let j = 0; j < this.dof; j++) {
            // apply small step to approximate instantaneous velociites
            this.theta[j] += step;
            this.apply_theta();
            const new_p = this.get_end_effector_position();
            J[0][j] = (new_p[0] - p[0]) / step;
            J[1][j] = (new_p[1] - p[1]) / step;
            J[2][j] = (new_p[2] - p[2]) / step;
            this.theta[j] -= step;
        }

        return J; // 3x10 matrix
    }

    calculate_delta_theta(J, dx) { // from discussion slides
        const A = math.multiply(math.transpose(J), J);
        for (let i = 0; i < this.dof; i++) {
            A[i][i] += 1; // add identity matrix to prevent singularity
        }
        //console.log(A);
        const b = math.multiply(math.transpose(J), dx);
        //console.log(b);
        const x = math.lusolve(A, b)
        //console.log(x);

        return x;
    }

    get_end_effector_position() { // from discussion slides
        // in this example, we only have one end effector.
        this.matrix_stack = [];
        this._rec_update(this.root, Mat4.identity());
        const v = this.end_effector.global_position; // vec4
        return vec3(v[0], v[1], v[2]);
    }

    _rec_update(arc, matrix) { // from discussion slides
        if (arc !== null) {
            const L = arc.location_matrix;
            const A = arc.articulation_matrix;
            matrix.post_multiply(L.times(A));
            this.matrix_stack.push(matrix.copy());

            if (arc.end_effector !== null) {
                arc.end_effector.global_position = matrix.times(arc.end_effector.local_position);
            }

            const node = arc.child_node;
            const T = node.transform_matrix;
            matrix.post_multiply(T);

            matrix = this.matrix_stack.pop();
            for (const next_arc of node.children_arcs) {
                this.matrix_stack.push(matrix.copy());
                this._rec_update(next_arc, matrix);
                matrix = this.matrix_stack.pop();
            }
        }
    }

    draw(webgl_manager, uniforms, material) { // from discussion slides
        this.matrix_stack = [];
        this._rec_draw(this.root, Mat4.identity(), webgl_manager, uniforms, material);
    }

    _rec_draw(arc, matrix, webgl_manager, uniforms, material) { // from discussion slides
        if (arc !== null) {
            const L = arc.location_matrix;
            const A = arc.articulation_matrix;
            matrix.post_multiply(L.times(A));
            this.matrix_stack.push(matrix.copy());

            const node = arc.child_node;
            const T = node.transform_matrix;
            matrix.post_multiply(T);
            node.shape.draw(webgl_manager, uniforms, matrix, material);

            matrix = this.matrix_stack.pop();
            for (const next_arc of node.children_arcs) {
                this.matrix_stack.push(matrix.copy());
                this._rec_draw(next_arc, matrix, webgl_manager, uniforms, material);
                matrix = this.matrix_stack.pop();
            }
        }
    }

    debug(arc=null, id=null) { // from discussion slides
        console.log(this.get_end_effector_position());
        // this.theta = this.theta.map(x => x + 0.01);
        // this.apply_theta();
        const J = this.calculate_Jacobian();
        let dx = [[0], [-0.02], [0]];
        if (id === 2)
            dx = [[-0.02], [0], [0]];
        const dtheta = this.calculate_delta_theta(J, dx);

        // const direction = new Array(this.dof);
        // let norm = 0;
        // for (let i = 0; i < direction.length; i++) {
        //     direction[i] = dtheta[i][0];
        //     norm += direction[i] ** 2.0;
        // }
        // norm = norm ** 0.5;
        // console.log(direction);
        // console.log(norm);
        // this.theta = this.theta.map((v, i) => v + 0.01 * (direction[i] / norm));
        this.theta = this.theta.map((v, i) => v + dtheta[i][0]);
        this.apply_theta();

        // if (arc === null)
        //     arc = this.root;
        //
        // if (arc !== this.root) {
        //     arc.articulation_matrix = arc.articulation_matrix.times(Mat4.rotation(0.02, 0, 0, 1));
        // }
        //
        // const node = arc.child_node;
        // for (const next_arc of node.children_arcs) {
        //     this.debug(next_arc);
        // }
    }
}

class Node { // from discussion slides
    constructor(name, shape, transform) {
        this.name = name;
        this.shape = shape;
        this.transform_matrix = transform;
        this.children_arcs = [];
    }
}

class Arc { // from discussion slides
    constructor(name, parent, child, location) {
        this.name = name;
        this.parent_node = parent;
        this.child_node = child;
        this.location_matrix = location;
        this.articulation_matrix = Mat4.identity();
        this.end_effector = null;
        this.dof = {
            Tx: false,
            Ty: false,
            Tz: false,
            Rx: false,
            Ry: false,
            Rz: false,
        }
    }

    set_dof(tx, ty, tz, rx, ry, rz) {
        this.dof.Tx = tx;
        this.dof.Ty = ty;
        this.dof.Tz = tz;
        this.dof.Rx = rx;
        this.dof.Ry = ry;
        this.dof.Rz = rz;
    }

    update_articulation(theta) {
        this.articulation_matrix = Mat4.identity();
        let index = 0;
        if (this.dof.Tx) {
            this.articulation_matrix.pre_multiply(Mat4.translation(theta[index], 0, 0));
            index += 1;
        }
        if (this.dof.Ty) {
            this.articulation_matrix.pre_multiply(Mat4.translation(0, theta[index], 0));
            index += 1;
        }
        if (this.dof.Tz) {
            this.articulation_matrix.pre_multiply(Mat4.translation(0, 0, theta[index]));
            index += 1;
        }
        if (this.dof.Rx) {
            this.articulation_matrix.pre_multiply(Mat4.rotation(theta[index], 1, 0, 0));
            index += 1;
        }
        if (this.dof.Ry) {
            this.articulation_matrix.pre_multiply(Mat4.rotation(theta[index], 0, 1, 0));
            index += 1;
        }
        if (this.dof.Rz) {
            this.articulation_matrix.pre_multiply(Mat4.rotation(theta[index], 0, 0, 1));
        }
    }
}

class End_Effector { // from discussion slides
    constructor(name, parent, local_position) {
        this.name = name;
        this.parent = parent;
        this.local_position = local_position;
        this.global_position = null;
    }
}