// Compt for copying as a MessageSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from './SubtitlesMachine'
import {
  Toast,
  Icon,
} from 'antd-mobile'



/*
  <MessageSegment
    title='Plain MessageSegment'
    schema={{ id: '1', endpoint: '2' }}
    texts={[
      { id: '1-1', text: 'Some string to display' },
      { id: '1-2', text: 'The next string to display!' }
    ]}
    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
    triggerScrollDown={() => this.triggerScrollDown()}
    segmentStyles={{ padding: '30px 0px 0px 0px' }}
    skippable={false}
    skipEndpoint=''
  />
*/



class MessageSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      data: {
        value: false,
      }
    }
  }

  componentWillMount() {
    if (this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
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

  nextSegment(e, endpoint = this.props.schema.endpoint) {
    if (e) {
      e.stopPropagation()
    }
    this.props.onDone(this.props.schema.id, endpoint, this.state.data)
  }

	render() {
		return (
			<div id={`MessageSegment--${this.props.schema.id}`} style={{ ...comStyles().container, ...this.props.segmentStyles }}>
        {
          this.props.title
          ?
          <div style={{ padding: '0px 0px 20px 0px', display: 'flex', borderBottom: '1px solid rgba(256,256,256,0.4)' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(256,256,256,0.4)' }}>{this.props.title.toUpperCase()}</span>
          </div>
          :
          null
        }
        <div>
        {
          this.props.texts.map((text, txtIndex) => {
            return (
              <div>
                {
                  this.shouldDisplayText(text, txtIndex) || this.state.instantChars
                  ?
                  <SubtitlesMachine
                    id={`Subtitle--${this.props.schema.id}--${text.id}`}
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
                        if (this.shouldDisplayInput()) {
                          setTimeout(() => {
                            this.nextSegment()
                          }, 1000)
                        }
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
			</div>
		)
	}
}

// defines the types of variables in this.props
MessageSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
  title: PropTypes.string,                  // passed in
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string.isRequired, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  onDone: PropTypes.func.isRequired,        // passed in
  skippable: PropTypes.bool,                // passed in
  skipEndpoint: PropTypes.string,           // passed in
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
}

// for all optional props, define a default value
MessageSegment.defaultProps = {
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MessageSegment)

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
      padding: '100px 0px 100px 0px'
		},
    skip: {
      padding: '5px',
      minWidth: '50px',
      border: '1px solid white',
      borderRadius: '5px',
      fontSize: '0.8rem',
      color: 'white',
      cursor: 'pointer',
      position: 'absolute',
      bottom: '20px',
      left: '0px',
      ":hover": {
        opacity: 0.5
      }
    },
		check: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '20px',
			right: '0px',
		}
	}
}
