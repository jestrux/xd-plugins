const Sval = require("./sval");

function UIFramework(rootNode, state, { onStateChange = () => { }, methods = {} }) {
    this.rootNode = rootNode;
    this.state = { ...state };
    this.onStateChange = onStateChange;

    Object.assign(this, { ...methods });

    this.setupEventListeners();

    for (const [key, value] of Object.entries(this.state)) {
        this.update(key, value);
    }
}

UIFramework.prototype.evaluate = function (query, write = false) {
    const interpreter = new Sval({ sandBox: true });
    const uiFrameworkProps = { ...this };
    delete uiFrameworkProps.state;

    interpreter.import({
        ...uiFrameworkProps,
        ...this.state
    });
    interpreter.run(`
        const result = ${query};
        exports.full = this;
        exports.newState = {
            ${Object.keys(this.state).map(key => `${key}: this.${key}`).join(',')}
        };
        exports.result = result;
    `);

    // const misMatches = Object.keys(interpreter.exports.newState).filter(key => {
    //     const value = interpreter.exports.newState[key];
    //     return this.state[key] != value;
    // })
    // .map(key => ({[key]: interpreter.exports.newState[key]}));

    // console.log("Mismatches: ", misMatches);

    if (write)
        this.setState(interpreter.exports.newState);

    return interpreter.exports.result;
}

UIFramework.prototype.setState = function (...args) {
    if (typeof args[0] === 'object') {
        const newState = args[0];

        for (const [key, value] of Object.entries(newState)) {
            this.update(key, value);
        }
    }
    else {
        const [key, value] = args;
        this.update(key, value);
    }
}

UIFramework.prototype.setupEventListeners = function () {
    this.rootNode.querySelectorAll("[x-model], [@click], [@submit], [@load]").forEach(node => {
        if (node.hasAttribute('x-model')) {
            const modelAttr = node.getAttribute("x-model");
            node.addEventListener("input", ({ target }) => this.setState(modelAttr, target.value));
        }
        else {
            const actionsAttributes = ["@click", "@submit", "@load"];
            const actionAttr = actionsAttributes.find(attribute => node.hasAttribute(attribute));
            const actionValue = node.getAttribute(actionAttr);

            // const [functionName, argString] = actionValue.replace(')', '').split('(');
            // const args = argString ? argString.replace(/'|\s/g, '').split(',') : [];

            node.addEventListener(actionAttr.replace('@', ''), _ => this.evaluate(actionValue, true));
        }
    });
}

UIFramework.prototype.applyDataBinding = async function (key, value) {
    const matchers = `
        [x-show], [x-text], [x-html], [x-src], 
        [x-bind-class], [x-bind-style], 
        [x-model="${key}"],
    `;
    const matchingNodes = Array.from(this.rootNode.querySelectorAll(matchers));

    if (matchingNodes.length) {
        matchingNodes.forEach(node => {
            if (node.hasAttribute('x-show')) {
                const show = this.evaluate(node.getAttribute('x-show'));
                node.style.display = show ? '' : 'none !important';
            }

            if (node.hasAttribute('x-model') && node.value !== value)
                node.value = value;

            if (node.hasAttribute('x-text'))
                node.textContent = this.evaluate(node.getAttribute('x-text'));

            if (node.hasAttribute('x-html')) {
                node.innerHTML = "";

                const htmlContent = this.evaluate(node.getAttribute('x-html'));
                if (Array.isArray(htmlContent)) {
                    htmlContent.forEach(item => {
                        node.appendChild(item);
                    });
                }
                else
                    node.innerHTML = htmlContent;
            }

            if (node.hasAttribute('x-src')) {
                node.src = "";

                setTimeout(() => {
                    node.src = this.evaluate(node.getAttribute('x-src'));
                }, 10);
            }

            if (node.hasAttribute('x-bind-class')) {
                if(!node.hasAttribute('original-classes'))
                    node.setAttribute('original-classes', node.getAttribute('class'));

                const originalClasses = node.getAttribute('original-classes');
                const evaluatedClasses = this.evaluate(node.getAttribute('x-bind-class'));
                node.setAttribute("class", `${originalClasses} ${evaluatedClasses}`);
            }

            if (node.hasAttribute('x-bind-style')) {
                const evaluatedStyles = this.evaluate(node.getAttribute('x-bind-style'));
                Object.assign(node.style, evaluatedStyles);
            }
        });
    }
}

UIFramework.prototype.update = function (key, value) {
    const el = this.rootNode;

    if (key === 'observe' || !el)
        return;

    if (!el.className) el.className = "";

    var prefix = `uiFramework-${key}-`;
    var classes = el.className.split(" ").filter(c => c.indexOf(prefix, 0) !== 0);
    el.className = classes.join(" ").trim() + ` ${prefix + value}`;

    this.state[key] = value;
    this.onStateChange(key, value);
    this.applyDataBinding(key, value);
}

module.exports = UIFramework;