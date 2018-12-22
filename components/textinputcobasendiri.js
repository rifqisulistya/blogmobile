Import React, {Component} from React;


Class CobaTextInput extends Component {
	constructor (props) {
		super (props);
		this.state = {text: ''}; 
	}

	render () {
		return (
			<view>
				<TextInput
					placeholder= 'Share your story!'
					onChangeText= {(text) => this.setState({text})} 
				/>
			</view>			
		)
	}
}