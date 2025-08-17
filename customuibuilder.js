const id = ++this.currentId;
        this.components[id] = { type, props };
        return id;
    }

    renderComponent(id) {
        const component = this.components[id];
        if (!component) {
            throw new Error('Component not found');
        }
        return this.render(component);
    }

    editComponent(id, props) {
        const component = this.components[id];
        if (!component) {
            throw new Error('Component not found');
        }
        component.props = { ...this.deepCopy(component.props), ...props };
    }

    deleteComponent(id) {
        if (!this.components[id]) {
            throw new Error('Component not found');
        }
        delete this.components[id];
    }

    render(component) {
        if (!component || !component.type || !component.props) {
            throw new Error('Invalid component structure');
        }
        return `<div class="${component.type}" style="${this.propsToStyle(component.props)}"></div>`;
    }

    propsToStyle(props) {
        return Object.entries(props)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ');
    }

    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

module.exports = CustomUIBuilder;