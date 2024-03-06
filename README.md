# CS C174C Assignment 2
Eliot Yoon  
505800319  
  
Credit to TA Mike Li for template code in human.js and shapes.js  
Grading:
1. Classroom and blackboard are visible in the animation. Implemented in lines 162-165 in assignment2.js
2. Figure eight spline shape visible on blackboard in animation. Implemented in lines 54-66 and 186 in assignment2.js
3. Model human visible in animation. Implemented in lines 17-143 in human.js
4. Inverse kinematics solver implemented in lines 154-250 in human.js
5. Visible in initial animation. Implemented in lines 172-177 in assignment2.js
6. Visible in animation. Implemented in lines 178-184

Notes on this implementation:
- Uses the math.js library, as recommended by TA Mike Li. This library is already included in the project folder and is also linked in line 7 of index.html.
- All 10 required degrees of freedom are implemented. However, there are constraints imposed on some of these in lines 173-206 in human.js. The translational degrees of freedom are limited to allow for greater arm rotation, and the y translational dof is constrained to 0 to prevent floating or sinking. The arm's rotational dof's are also limited to better model human movement.
- If performance of the animation is an issue, several parameters can be edited to improve performance at the cost of quality and precision. The value of epsilon (default = 0.3) in line 183 of assignment2.js, k (default = 0.1) in line 158 of human.js, or step (default = 0.01) in line 222 of human.js can be increased.

Short clip of running animation included in project folder. Webpage is reloaded after recording start and entire beginning and looping portion of animation can be seen, although screen recording significantly reduced performance of animation.