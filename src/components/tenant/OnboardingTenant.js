// Compt for copying as a OnboardingTenant
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import {
	Icon,
	Slider,
	WhiteSpace,
	Checkbox,
} from 'antd-mobile'


class OnboardingTenant extends Component {

	constructor() {
		super()
		this.state = {
			show_up: true,
			show_down: true,
			step: 0,

			full_name: '',
			people: 1,
			max_budget_person: 700,
			commute_mode: '',
			agreed_terms: false,

			destination_address_components: [],
      destination_address_lat: 0,                // the ad lat according to google
      destination_address_lng: 0,               // the ad lng according to google
      destination_address_place_id: '',          // the ad place_id according to google
      destination_address: '',					  // the ad_address typed in
		}
	}

	clickedCheck(nextDiv) {
		this.setState({ step: this.state.step + 1 }, () => {
			history.pushState(null, null, `${this.props.location.pathname}${nextDiv}`)
			$('#middle_part').animate({
					scrollTop: document.getElementById("middle_part").scrollHeight - $(nextDiv).position().top
			}, 500);
		})
	}

	incrementCounter(attr, inc) {
    if (this.state[attr] + inc >= 0) {
      this.setState({
        [attr]: this.state[attr] + inc
      })
    }
  }

	startAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('destination_address')),
            {
              // types: ['address', 'establishment'],
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace()
    this.setState({
      destination_address_components: place.address_components,
      destination_address_lat: place.geometry.location.lat().toFixed(7),
      destination_address_lng: place.geometry.location.lng().toFixed(7),
      destination_address_place_id: place.place_id,
      destination_address: place.formatted_address,
    }, () => console.log(this.state))
		const destination_coords = { lat: parseFloat(place.geometry.location.lat().toFixed(7)), lng: parseFloat(place.geometry.location.lng().toFixed(7)) }
		const map = new google.maps.Map(document.getElementById('destination-map'), {
			center: destination_coords,
			zoom: 13,
			disableDefaultUI: true,
		})
		const marker = new google.maps.Marker({position: destination_coords, map: map});
  }


	render() {
		return (
			<div id='OnboardingTenant' style={comStyles().container}>
        <div style={comStyles().scroll}>
					{/*<div style={comStyles().up_part}>
						{
							this.state.show_up
							?
							<Icon type='up' size='lg' style={comStyles().up} />
							:
							null
						}
					</div>*/}
					<div id='middle_part' style={comStyles().middle_part}>
						<div id='ask_name' style={comStyles().sectional}>
							<SubtitlesMachine
									speed={0.25}
									delay={500}
									text={`I'm so excited to help you find a home! 😊 What is your name?`}
									textStyles={{
										fontSize: '1.3rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										console.log('DONE')
										setTimeout(() => {
											this.setState({ step: this.state.step + 1 })
											// console.log('DONE')
										}, 500)
									}}
								/>
							{
								this.state.step >= 1
								?
								<div style={comStyles().field_holder}>
									<input
		                id="input_field"
		                value={this.state.string1}
		                onChange={(e) => {
		                  console.log(e.target.value)
		                  this.setState({ full_name: e.target.value })
		                }}
		                placeholder="Full Name"
		                style={inputStyles().text}
		              ></input>
									{
										this.state.full_name
										?
										<Icon onClick={() => this.clickedCheck('#ask_destination')} type='check-circle' size='lg' style={comStyles().check} />
										:
										null
									}
								</div>
								:
								null
							}
						</div>
						{
							this.state.step >= 2
							?
							<div id='ask_destination' style={comStyles().sectional}>
								<SubtitlesMachine
										speed={0.25}
										delay={800}
										text={`Nice to meet you ${this.state.full_name.split(' ')[0].charAt(0).toUpperCase() + this.state.full_name.split(' ')[0].slice(1)}. Where do you travel to most days?`}
										textStyles={{
											fontSize: '1.3rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											padding: '20px',
											borderRadius: '20px',
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ step: this.state.step + 1 })
												this.startAutocomplete()
											}, 300)
										}}
									/>
									{
										this.state.step >= 3
										?
										<div style={comStyles().field_holder}>
											<input
												id="destination_address"
												value={this.state.destination_address}
												onChange={(e) => {
													console.log(e.target.value)
													this.setState({ destination_address: e.target.value })
												}}
												placeholder="Enter Location"
												style={inputStyles().text}
											></input>
											<div id='destination-map' style={{ height: '250px', borderRadius: '10px', margin: '10px 0px 0px 0px' }}></div>
											{
												this.state.destination_address
												?
												<Icon onClick={() => this.clickedCheck('#commute_mode')} type='check-circle' size='lg' style={comStyles().check} />
												:
												null
											}
										</div>
										:
										null
									}
							</div>
							:
							null
						}
						{
							this.state.step >= 4
							?
							<div id='commute_mode' style={comStyles().sectional}>
								<SubtitlesMachine
										speed={0.25}
										delay={800}
										text={`How would you like me to show your commute times?`}
										textStyles={{
											fontSize: '1.3rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											padding: '20px',
											borderRadius: '20px',
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ step: this.state.step + 1 })
											}, 300)
										}}
									/>
									{
										this.state.step >= 5
										?
										<div style={comStyles().field_holder}>
											<div style={travelStyles().listDiv}>
												<div onClick={() => this.setState({ commute_mode: 'driving' })} style={travelStyles(this.state.commute_mode).driving}>DRIVING</div>
												<div onClick={() => this.setState({ commute_mode: 'transit' })} style={travelStyles(this.state.commute_mode).transit}>TRANSIT</div>
												<div onClick={() => this.setState({ commute_mode: 'bicycling' })} style={travelStyles(this.state.commute_mode).bicycling}>BICYCLING</div>
												<div onClick={() => this.setState({ commute_mode: 'walking' })} style={travelStyles(this.state.commute_mode).walking}>WALKING</div>
											</div>
											{
												this.state.commute_mode
												?
												<Icon onClick={() => this.clickedCheck('#section_two')} type='check-circle' size='lg' style={comStyles().check} />
												:
												null
											}
										</div>
										:
										null
									}
							</div>
							:
							null
						}
						{
							this.state.step >= 6
							?
							<div id='section_two' style={comStyles().sectional}>
								<SubtitlesMachine
										speed={0.25}
										delay={800}
										text={`How many people are in your group?`}
										textStyles={{
											fontSize: '1.3rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											padding: '20px',
											borderRadius: '20px',
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ step: this.state.step + 1 })
											}, 300)
										}}
									/>
									{
										this.state.step >= 7
										?
										<div style={comStyles().field_holder}>
											<div style={inputStyles().counterDiv}>
				                <div onClick={() => this.incrementCounter('people', -1)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>-</div>
				                <div style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>{this.state.people}</div>
				                <div onClick={() => this.incrementCounter('people', 1)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>+</div>
				              </div>
											<Icon onClick={() => this.clickedCheck('#section_three')} type='check-circle' size='lg' style={comStyles().check} />
										</div>
										:
										null
									}
							</div>
							:
							null
						}
						{
							this.state.step >= 8
							?
							<div id='section_three' style={comStyles().sectional}>
								<SubtitlesMachine
										speed={0.25}
										delay={800}
										text={`And what's your max budget per person?`}
										textStyles={{
											fontSize: '1.3rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											padding: '20px',
											borderRadius: '20px',
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ step: this.state.step + 1 })
											}, 300)
										}}
									/>
									{
										this.state.step >= 9
										?
										<div style={comStyles().field_holder}>
											<div style={inputStyles().counterDiv}>
				                <div onClick={() => this.incrementCounter('max_budget_person', -25)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>-</div>
												<div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>${this.state.max_budget_person}</div>
				                <div onClick={() => this.incrementCounter('max_budget_person', 25)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>+</div>
											</div>
											<WhiteSpace size="lg" />
											<Slider
												style={{ }}
												defaultValue={700}
												min={300}
												max={2500}
												step={25}
												value={this.state.max_budget_person}
												onChange={(v) => this.setState({ max_budget_person: v })}
											/>
											<Icon onClick={() => this.clickedCheck('#section_three')} type='check-circle' size='lg' style={comStyles().check} />
										</div>
										:
										null
									}
							</div>
							:
							null
						}
						{
							this.state.step >= 10
							?
							<div id='section_three' style={comStyles().sectional}>
								<SubtitlesMachine
										speed={0.25}
										delay={800}
										text={`Great! I'll go search the internet for listings that match your preferences. 🔍`}
										textStyles={{
											fontSize: '1.3rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											padding: '20px',
											borderRadius: '20px',
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ step: this.state.step + 1 })
											}, 300)
										}}
									/>
									{
										this.state.step >= 11
										?
										<SubtitlesMachine
												speed={0.25}
												delay={800}
												text={`Let's browse some properties! 😄`}
												textStyles={{
													fontSize: '1.3rem',
													color: 'white',
													textAlign: 'left',
												}}
												containerStyles={{
													width: '100%',
													backgroundColor: 'rgba(0,0,0,0)',
													padding: '20px',
													borderRadius: '20px',
												}}
												doneEvent={() => {
													console.log('DONE')
													setTimeout(() => {
														this.setState({ step: this.state.step + 1 })
													}, 300)
												}}
											/>
										:
										null
									}
									{
										this.state.step >= 12
										?
										<div>
											<Checkbox.AgreeItem onChange={(e) => this.setState({ agreed_terms: e.target.checked })}>
						            <span style={{ color: 'white' }}>Agree to </span><a href='https://terms.renthero.com' target='_blank' style={{ textDecoration: 'none', color: 'white' }}>Terms of Use and Privacy Policy</a>
						          </Checkbox.AgreeItem>
										</div>
										:
										null
									}
									{
										this.state.agreed_terms
										?
										<div onClick={() => this.props.history.push('/matches')} style={inputStyles().button}>
											VIEW MATCHES
										</div>
										:
										null
									}
							</div>
							:
							null
						}
					</div>
					<div style={comStyles().down_part}>
						{
							this.state.show_down
							?
							<Icon onClick={() => {
								$('#middle_part').animate({
										scrollTop: document.getElementById("middle_part").scrollHeight
								}, 500);
							}} type='down' size='lg' style={comStyles().down} />
							:
							null
						}
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
OnboardingTenant.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
OnboardingTenant.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(OnboardingTenant)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
      minHeight: '100vh',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    scroll: {
      display: 'flex',
      flexDirection: 'column',
			position: 'fixed',
      minHeight: '90vh',
			bottom: '0px',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
		up_part: {
			position: 'fixed',
			top: '0px',
			height: '15vh',
			minHeight: '15vh',
			maxHeight: '15vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		middle_part: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      height: '90vh',
      width: '100%',
      maxWidth: '500px',
			overflowY: 'scroll',
			padding: '20px 20px 20px 20px',
		},
		down_part: {
			position: 'fixed',
			bottom: '0px',
			height: '10vh',
			minHeight: '10vh',
			maxHeight: '10vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		up: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		down: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		sectional: {
			height: '90vh',
			minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
			padding: '20px 0px 0px 0px',
			width: '100%',
		},
		field_holder: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			position: 'relative',
			padding: '20px 0px 70px 0px'
		},
		check: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '0px',
			right: '0px',
		}
	}
}


const inputStyles = () => {
  return {
    text: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: '#ffffff',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    },
		counterDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '30px'
    },
    button: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '90%',
      borderRadius: '15px',
      textAlign: 'center',
      cursor: 'pointer',
			position: 'absolute',
			bottom: '10vh'
    },
  }
}

const travelStyles = (mode) => {
	let listOptions = {
		padding: '10px',
		fontSize: '0.8rem',
		color: 'white',
		border: '1px solid white',
		borderRadius: '15px',
		margin: '10px',
		cursor: 'pointer',
		minWidth: '100px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}
	let driveStyles = {}
	let transitStyles = {}
	let bicycleStyles = {}
	let walkStyles = {}
	if (mode === 'driving') {
		driveStyles.color = '#009cff'
		driveStyles.backgroundColor = 'white'
	}
	if (mode === 'transit') {
		transitStyles.color = '#009cff'
		transitStyles.backgroundColor = 'white'
	}
	if (mode === 'bicycling') {
		bicycleStyles.color = '#009cff'
		bicycleStyles.backgroundColor = 'white'
	}
	if (mode === 'walking') {
		walkStyles.color = '#009cff'
		walkStyles.backgroundColor = 'white'
	}
	return {
		listDiv: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			flexWrap: 'wrap',
			width: '100%',
			padding: '30px'
		},
		driving: {
			...listOptions,
			...driveStyles,
		},
		transit: {
			...listOptions,
			...transitStyles,
		},
		bicycling: {
			...listOptions,
			...bicycleStyles,
		},
		walking: {
			...listOptions,
			...walkStyles
		}
	}
}
