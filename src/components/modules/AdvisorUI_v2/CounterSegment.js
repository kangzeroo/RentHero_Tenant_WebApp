// Compt for copying as a CounterSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import SubtitlesMachine from './SubtitlesMachine'
import {
  Toast,
} from 'antd-mobile'



/*
  <CounterSegment
    schema={{ id: '1', endpoint: '2' }}
    texts={[
      { id: '1-1', text: 'Some string to display' },
      { id: '1-2', text: 'The next string to display!' }
    ]}
    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
    triggerScrollDown={() => this.triggerScrollDown()}
    renderCountValue={(v) => (<div><span>{v} </span><span style={{ fontSize: '0.8rem' }}>rooms</span></div>)}
    segmentStyles={{ padding: '30px 0px 0px 0px' }}
    slider
    sliderOptions={{ min: 10, max: 100, step: 5 }}
    incrementerOptions={{ max: 100, min: 10, step: 5 }}
  />
*/



class CounterSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      data: {
        count: 0,
      }
    }
  }

  componentWillMount() {
    if (this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          count: this.props.incrementerOptions.min,
          ...this.props.initialData
        }
      })
    }
    if (this.props.instant_chars_segment_id === this.props.schema.id) {
      this.setState({
        instantChars: true
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initialData !== this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
    if (prevProps.instant_chars_segment_id !== this.props.instant_chars_segment_id) {
      if (this.props.instant_chars_segment_id === this.props.schema.id) {
        this.setState({
          instantChars: true
        })
      }
    }
  }

  clickedIncrementer(amount, direction) {
    const x = amount * direction
    console.log(this.state.data.count + x)
    if (this.state.data.count + x < this.props.incrementerOptions.min) {
      Toast.info(`Minimum is ${this.props.incrementerOptions.min}`, 1)
    } else if (this.state.data.count + x > this.props.incrementerOptions.max) {
      Toast.info(`Maximum is ${this.props.incrementerOptions.max}`, 1)
    } else {
      this.setState({ data: { ...this.state.data, count: this.state.data.count + x } })
    }
  }

  shouldDisplayText(text, txtIndex) {
    if (txtIndex === 0) {
      return true
    } else {
      return this.state.completedSections.filter((id) => {
        return this.props.texts[txtIndex - 1].id === id
      }).length > 0
    }
  }

  shouldInstantChars(txtIndex) {
    if (txtIndex === 0) {
      return false
    } else {
      let allOtherTextsLoadedCount = 0
      this.props.texts.forEach((text) => {
        this.state.completedSections.forEach((sec) => {
          if (text.id === sec.id) {
            allOtherTextsLoadedCount += 1
          }
        })
      })
      return allOtherTextsLoadedCount === this.props.texts.length
    }
  }

  shouldDisplayInput() {
    if (this.state.instantChars) {
      return true
    } else {
      let allOtherTextsLoadedCount = 0
      this.props.texts.forEach((text) => {
        this.state.completedSections.forEach((id) => {
          if (text.id === id) {
            allOtherTextsLoadedCount += 1
          }
        })
      })
      return allOtherTextsLoadedCount === this.props.texts.length
    }
  }

  nextSegment(e) {
    e.stopPropagation()
    this.props.onDone(this.props.schema.id, this.props.schema.endpoint, this.state.data)
  }

	render() {
		return (
			<div id='CounterSegment' style={{ ...comStyles().container, ...this.props.segmentStyles }}>
        <div style={{ padding: '20px' }}>
          <span style={{ fontSize: '2rem', color: 'white' }}>{`SEGMENT ${this.props.schema.id}`}</span>
        </div>
        <div>
        {
          this.props.texts.map((text, txtIndex) => {
            return (
              <div>
                {
                  this.shouldDisplayText(text, txtIndex) || this.state.instantChars
                  ?
                  <SubtitlesMachine
                    id={text.id}
                    key={`${text.id}_${txtIndex}`}
    								instant={this.state.instantChars || this.shouldInstantChars(txtIndex)}
    								speed={0.25}
    								delay={this.state.instantChars || this.shouldInstantChars(txtIndex) ? 0 : 500}
    								text={text.text}
    								textStyles={{
    									fontSize: '1.1rem',
    									color: 'white',
    									textAlign: 'left',
    								}}
    								containerStyles={{
    									width: '100%',
    									backgroundColor: 'rgba(0,0,0,0)',
    									margin: '20px 0px 20px 0px',
    								}}
    								doneEvent={() => {
  										this.setState({ completedSections: this.state.completedSections.concat([text.id]) }, () => {
                        this.props.triggerScrollDown(null, 1000)
                      })
    								}}
    							/>
                  :
                  null
                }
              </div>
            )
          })
        }
        </div>
        <div>
          {
            this.shouldDisplayInput() || this.state.instantChars
            ?
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        				<span onClick={() => this.clickedIncrementer(this.props.incrementerOptions.step, -1)} style={{ fontSize: '2rem', color: 'white', margin: '5px' }}>-</span>
                <span style={{ fontSize: '3rem', color: 'white', margin: '5px' }}>{this.props.renderCountValue(this.state.data.count)}</span>
        				<span onClick={() => this.clickedIncrementer(this.props.incrementerOptions.step, 1)} style={{ fontSize: '2rem', color: 'white', margin: '5px' }}>+</span>
              </div>
              {
                this.props.slider && this.props.sliderOptions
                ?
                <div style={{ width: '80%', alignSelf: 'center' }}>
                  <Slider
                    value={this.state.data.count}
                    min={this.props.sliderOptions.min}
                    max={this.props.sliderOptions.max}
                    step={this.props.sliderOptions.step}
                    onChange={(v) => this.setState({ data: { ...this.state.data, count: v } })}
                  />
                </div>
                :
                null
              }
            </div>
            :
            null
          }
        </div>
        <div style={{ padding: '20px', height: '50px' }}>
          {
            this.state.data.count && this.shouldDisplayInput()
            ?
            <span onClick={(e) => this.nextSegment(e)} style={{ fontSize: '0.8rem', color: 'white', margin: '5px' }}>Done</span>
            :
            null
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
CounterSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string.isRequired, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  onDone: PropTypes.func.isRequired,        // passed in
  texts: PropTypes.array,        // passed in, text to say
  /*
    texts = [
      { id: 'parentID-textID', text: 'Some string to display' }
    ]
  */
  segmentStyles: PropTypes.object,          // passed in, style of container
  schema: PropTypes.object.isRequired,      // passed in, schema for the internal data. Whats my id? Where to go next?
  /*
    schema.id = 'abc'
    schema.endpoint = 'xyz'
    schema.choices = [
      { id: 'parentID-choiceID', text: 'Something to show', endpoint: 'targetID'  }
    ]
  */

  // UNIQUE PROPS FOR COMPONENT
  incrementerOptions: PropTypes.object.isRequired,      // passed in, what should the { max, min } be?
  /*
    incrementerOptions = { max: 5, min: 1 }
  */
  slider: PropTypes.bool,                   // passed in, should the slider appear?
  sliderOptions: PropTypes.object,          // passed in, what slider options should there be?
  /*
    // see here for full options: https://github.com/react-component/slider
    sliderOptions = {
      min: 0,
      max: 100,
      step: 5,
      vertical: false,
    }
  */
  renderCountValue: PropTypes.func,
}

// for all optional props, define a default value
CounterSegment.defaultProps = {
  initialData: {},
  slider: false,
  sliderOptions: {},
  segmentStyles: {},
  texts: [],
  renderCountValue: (count) => { return count}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CounterSegment)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    instant_chars_segment_id: redux.app.instant_chars_segment_id,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '25px 0px 25px 0px'
		}
	}
}
