import {tiny, defs} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Shape, Material, Shader, Texture, Component } = tiny;

export class Spline {
    constructor() {
        this.points = [];
        this.tangents = [];
        this.scaled_tangents = [];
        this.size = 0;
        this.length_table = []
    }

    reset_spline() {
        this.points = [];
        this.tangents = [];
        this.scaled_tangents = [];
        this.size = 0;
        this.length_table = []
    }

    add_point(x, y, z, tx, ty, tz) {
        this.points.push(vec3(x, y, z));
        this.tangents.push(vec3(tx, ty, tz));
        this.scaled_tangents.push(vec3(0, 0, 0));
        this.size += 1;
        //this.length_table.push(0);
        this.scale_tangents();
        this.update_table();
    }

    update_tangent(index, x, y, z) {
        this.tangents[index] = vec3(x, y, z);
        this.scale_tangents();
        this.update_table();
    }

    update_point(index, x, y, z) {
        this.points[index] = vec3(x, y, z);
        this.update_table();
    }

    scale_tangents() {
        for (let i = 0; i < this.size; i++) {
            this.scaled_tangents[i] = this.tangents[i].times(1 / (this.size - 1));
        }
    }

    get_position(t) {
        if (this.size < 2) {return vec3(0, 0, 0);}

        const A = Math.floor(t * (this.size - 1)); // A = T(i)
        const B = Math.ceil(t * (this.size - 1)); // B = T(i + 1)
        const s = (t * (this.size - 1)) % 1.0 // T - T(i)

        let a = this.points[A].copy();
        let b = this.points[B].copy();
        let ta = this.scaled_tangents[A].copy();
        let tb = this.scaled_tangents[B].copy();

        return a.times(2 * (s ** 3) - 3 * (s ** 2) + 1)
            .plus(b.times(-2 * (s ** 3) + 3 * (s ** 2)))
            .plus(ta.times((s ** 3) - 2 * (s ** 2) + s))
            .plus(tb.times((s ** 3) - (s ** 2)))
    }

    update_table() {
        if (this.size < 2) return;
        let num_entries = 101;
        let length = 0;
        this.length_table = [];
        let prev = this.get_position(0);
        this.length_table.push([0, 0]);
        for (let i = 1.0; i < num_entries; i++) {
            const curr = this.get_position(i / (num_entries - 1));
            length += curr.minus(prev).norm();
            prev = curr;
            this.length_table.push([i / (num_entries - 1), length]);
        }
    }

    get_length(u) {
        const distance_between_entries = 1 / (this.length_table.length - 1);
        const i = Math.floor(u / distance_between_entries);
        if (i === this.length_table.length - 1)
            return this.length_table[i][1];
        return this.length_table[i][1] +
            ((u - this.length_table[i][0]) / (this.length_table[i + 1][0] - this.length_table[i][0])) *
            (this.length_table[i + 1][1] - this.length_table[i][1]);
    }

    get_u(s) {
        let u_a = 0, u_b = 1.0, u_c;
        // let u_c = (u_a + u_b) / 2.0;
        // if (u_b - u_a === (1 / (this.length_table.length - 1)))
        //     return (u_a + u_b) / 2.0;
        // if (this.f(u_c, s) === 0)
        //     return u_c;
        // else if (this.f(u_a, s) * this.f(u_c, s) < 0)
        //     return this.get_u(s, u_a, u_c);
        // else
        //     return this.get_u(s, u_c, u_b);

        do {
            if (u_b - u_a <= (1 / (this.length_table.length - 1)))
                break;
            u_c = (u_a + u_b) / 2.0;
            if (this.f(u_c, s) === 0)
                return u_c;
            else if (this.f(u_a, s) * this.f(u_c, s) < 0)
                u_b = u_c;
            else
                u_a = u_c;
            //console.log(this.f(u_c, s));
        }
        while (Math.abs(this.f(u_c, s)) > 0.01)
        return u_c;
    }

    f(u, s) {
        return s - this.get_length(u);
    }

    constant_vel_fn(t) {
        // constant speed from t=0 to t=1, from s = 0 to s= arc length
        const spline_len = this.get_length(1);
        return t * spline_len;

    }
}