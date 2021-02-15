const md = require('markdown-it')();
const examples = [
  {
    name: "Components",
    code: `
component main() -> () {
  cells {
    c = prim std_reg(32); // A 32-bit register
  }
  wires { }
  control { }
}
    `,
    explanation: `
    Components are the basic building block of Calyx programs. A component
    has three sections: *cells*, *wires*, and *control*.
    An empty component does nothing.
    `,
  },
  {
    name: "Instantiating hardware",
    code: `
component main() -> () {
  cells {
    c = prim std_reg(32); // A 32-bit register
  }
  wires { }
  control { }
}
    `,
    explanation: `
    The *cells* section instantiates sub-components like adders and registers.
    These sub-components can be used in this component to define behaviour.
    `,
  },
  {
    name: "Continuous assignments",
    code: `
component main() -> () {
  cells {
    add = prim std_add(32); // A 32-bit adder
  }
  wires {
    add.left = 32'd0; // 32-bit 0
    add.right = 32'd10 // 32-bit 10
  }
  control { }
}
    `,
    explanation: `
    The *wires* section defines connections between hardware sub-components.
    The assignments are *non-blocking*, which means that left hand side updates as soon as the right hand side does.
    `,
  },
  {
    name: "Guarded assignments",
    code: `
component main() -> () {
  cells {
    add = prim std_add(32); // A 32-bit adder
    cmp = prim std_gt(32); // a 32-bit greater-than
  }
  wires {
    add.left = cmp.out ? 32'd0; // 32-bit 0
    add.left = cmp.out ? 32'd1; // 32-bit 1
    add.right = !cmp.out ? 32'd10 // 32-bit 10
  }
  control { }
}
    `,
    explanation: `
    Assignments can be *guarded* such that they are only activated when
    the condition is true. For example, in this case, the value on
    \`add.left\` is 0 when \`cmp.out\` is true and 1 otherwise.
    `,
  },
  {
    name: "Groups (1)",
    code:`
component main() -> () {
  cells {
    r = prim std_reg(32); // 32-bit register
    add = prim std_add(32); // A 32-bit adder
  }
  wires {
    group incr_reg {
      add.left = 32'd1;
      add.right = r.out;
      r.in = add.out;
      incr_reg[done] = r.done;
    }
  }
  control { }
}
`,
    explanation: `
    Groups provide a name to a group of assignments that implement some action.
    For example \`incr_reg\` increments the value in \`r\`. Groups also
    define a *done* assignment which becomes true when the group has finished
    its action.
    `
  },
  {
    name: "Groups (2)",
    code:`
component main() -> () {
  cells {
    r = prim std_reg(32); // 32-bit register
    add = prim std_add(32); // A 32-bit adder
  }
  wires {
    group reg_zero {
      r.in = 32'd0;
      incr_reg[done] = r.done;
    }
    group reg_one {
      r.in = 32'd1;
      incr_reg[done] = r.done;
    }
  }
  control { }
}
`,
    explanation: `
    Groups provide *encapsulation*: multiple groups can drive the same ports on
    hardware components without reasoning about assignments in other groups.
    Optimizations and analyses can therefore reason about individual groups instead
    of all assignments.
    `
  },
  {
    name: "Control (1)",
    code:`
component main() -> () {
  cells {
    r = prim std_reg(32); // 32-bit register
    add = prim std_add(32); // A 32-bit adder
  }
  wires {
    group reg_zero {
      r.in = 32'd0;
      incr_reg[done] = r.done;
    }
    group reg_one {
      r.in = 32'd1;
      incr_reg[done] = r.done;
    }
  }
  control {
    seq { reg_one; reg_zero; }
  }
}
`,
    explanation: `
    The *control* specifies the execution schedule of a component in terms
    of groups.
    In this example, the \`seq\` operator executes groups in a sequence.
    `
  },
  {
    name: "Control (2)",
    code:`
// Implement counter
`,
    explanation: `
    Groups and control can simplify specification of hardware programs while
    making analysis easier.
    This implementation of the counter uses the \`while\` control operator
    to specify the behavior of a counter.
    `
  },
  {
    name: "Optimization (1)",
    code:`
// resource sharing example
`,
    explanation: `
    TODO: resource sharing
    `
  },
  {
    name: "Optimization (2)",
    code:`
// minimize regs
`,
    explanation: `
    TODO: minimize regs
    `
  },
]


// Make sure all required fields of an example are defined.
function validateExample(example) {
  const exampleKeys = ['name', 'code', 'explanation'];
  let isValid = true;
  for (let k of exampleKeys) {
    if (typeof example[k] !== 'string') {
      console.warn("Not a valid example:" + JSON.stringify(example))
      isValid = false;
    }
  }
  return isValid;
}

// Setup button for an example. Update function cleans up the UI for the new
// example.
function addExample(example, updateFunc) {
  const buttonClasses = ["btn", "btn-default", "btn-block"];
  // The document element for the button:
  const el = document.createElement('BUTTON')
  for (let cls of buttonClasses) {
    el.classList.add(cls);
  }
  el.type = "button"
  el.innerHTML = example.name;
  // On clicking the button, update the editor and the explanation box.
  el.onclick = function () {
    updateFunc(example.code.trim());
    document.getElementById('explain').innerHTML =
      md.render(example.explanation.trim());
    document.getElementById('example-name').innerHTML =
      example.name;
  }

  const td = document.createElement('TD');
  td.appendChild(el);
  return td;
}

// Create a new horizontal button group
function newGroup() {
  let el = document.createElement('TR');
  return el;
}

function setupAll(updateFunc) {
  let fragment = document.createDocumentFragment();
  let curGroup = newGroup();
  let groupSize = 0;
  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i];
    if (validateExample(ex)) {
      curGroup.appendChild(addExample(ex, updateFunc));
      groupSize += 1;
    }
    if (groupSize === 2 || i === examples.length - 1) {
      fragment.appendChild(curGroup);
      curGroup = newGroup();
      groupSize = 0;
    }
  }
  document.getElementById('examples').appendChild(fragment);
}

exports.setupAll = setupAll;
