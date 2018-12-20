import { observable, action } from "mobx";

export const boxes = observable(new Map());

class Box {
  @observable top;
  @observable left;
  @observable width;
  @observable height;
  @observable datum;
  @observable state = 0;
  constructor(props) {
    Object.assign(this, props);
  }
  @action setValue(value) {
    this.datum = value;
  }
  @action openEditor() {
    this.state = 1;
  }
  @action closeEditor() {
    this.state = 0;
  }
}

class BoxGraph {
  @observable boxes = new Map();
  @action create(props) {
    this.boxes.set(`b-${this.boxes.size}`, new Box(props));
  }
}

export const globalBoxGraph = new BoxGraph();
