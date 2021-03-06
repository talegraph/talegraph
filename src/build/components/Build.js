import React from 'react';

import StoryPoint from './StoryPoint';
import graphs from '../../graphs';
import Modal from 'widgets/components/Modal';
const {Graph} = graphs.components;

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0
    };

    this.setDimension = this.setDimension.bind(this);
    this.setData = this.setData.bind(this);
    this.add = this.add.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  setDimension(column, dimension) {
    this.props.setDimension(this.state.currentIndex, dimension.field, column);
  }

  setData(data, columns) {
    this.props.setData(this.state.currentIndex, data, columns);
    if (!this.props.story.options.dataKey) {
      this.props.setDataKey(columns[0]);
      this.setState({
        showModal: true
      });
      // this.props.setDataKey(prompt('Input data key:'));
    }
  }

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  setStoryPointDesc(description) {
    this.props.setStoryPointDesc(this.state.currentIndex, description);
  }

  add() {
    const newStoryPoint = Object.assign({}, this.props.story.storyPoints[this.props.story.storyPoints.length - 1], {
      title: '',
      description: ''
    });
    this.props.addStoryPoint(newStoryPoint);
    this.goTo(this.props.story.storyPoints.length);
  }

  remove(removeIndex) {
    this.props.removeStoryPoint(removeIndex);
    if (this.state.currentIndex > 0) {
      this.goTo(this.state.currentIndex - 1);
    }
  }

  goTo(index) {
    this.setState({
      currentIndex: index
    });
  }

  getCurrent() {
    return this.props.story.storyPoints[this.state.currentIndex];
  }

  render() {
    const storyPoints = this.props.story.storyPoints.map((storyPoint, index) => {
      return (
        <div className={`pagination__item ${index === this.state.currentIndex ? 'pagination__item--active' : ''}`} key={index} onClick={() => this.goTo(index)}>
          Story point
          <div className="pagination__number">{index + 1}</div>
          {/* <button className="pagination__item--remove" onClick={() => this.remove(index)}>Remove</button> */}
        </div>
      );
    });

    return (
      <div>
        <div className="row u--border-bottom">
          <div className="col col--sm-5 col--md-4 col--full-width u--border-right">
            <StoryPoint
              storyPoint={this.getCurrent()}
              templateName={this.props.story.templateName}
              setDimension={this.setDimension}
              setData={this.setData}
              setTitle={title => this.props.setTitle(this.state.currentIndex, title)}
              setDescription={description => this.props.setDescription(this.state.currentIndex, description)}
            />
          </div>
          <div className="col col--sm-7 col--md-8 section">
            <Graph
              storyPoint={this.getCurrent()}
              options={this.props.story.options}
              templateName={this.props.story.templateName}
            />
          </div>
        </div>
        <div className="pagination pagination--dark">
          {storyPoints}
          <div className="pagination__item pagination__item--add" onClick={this.add}>
            Add
            <div className="pagination__number">+</div>
          </div>
        </div>
        <Modal isActive={this.state.showModal}>
          <div className="modal__header">
            <h3>Set ID:</h3>
          </div>
          <div className="modal__body">
            In order to be able to track your data between story points you need to select a unique identifier for every row.
            <div className="form-group">
              <label className="form-group__label">ID-column:</label>
              <select className="form-group__input" value={this.props.story.options.dataKey} onChange={event => this.props.setDataKey(event.target.value)}>
                {this.props.story.storyPoints[0].columns && this.props.story.storyPoints[0].columns.map(column =>
                  <option key={column}>{column}</option>
                )}
              </select>
            </div>
          </div>
          <div className="modal__footer">
            <button className="button button--primary" onClick={this.hideModal}>Save</button>
          </div>
        </Modal>
      </div>
    );
  }
}
