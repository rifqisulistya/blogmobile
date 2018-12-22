/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, AppRegistry, Button, Dimensions, FlatList, Platform, StyleSheet, Text, TextInput, View} from 'react-native';


export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      post: []
    };
  }

  handleChange = (text) => {
    this.setState({text})
  }

  handlePress = () => {
    this.setState(
      {
        post:[{text:this.state.text},...this.state.post],
        text:''
      }
    )
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View
        style={styles.item}
      >
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
    );
  };

  // componentDidMount () {
  //   axios.get("http://localhost:8080/blogmobile")
  //     .then (response => {
  //       this.setState({
  //         post: response.data
  //       })
  //       console.log(">>>response",response);
  //     })
  //     .catch(error => {
  //       console.log('err', error)
  //     }); 
  // }
  render() {
    console.log(this.state.post)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Blog Mobile App!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to post something!"
          onChangeText={this.handleChange}
          value={this.state.text}
        />
        <Button
          onPress={this.handlePress}
          title="Post it!"
        />
        <FlatList
          data={this.state.post}
          //renderItem={({item}) => <Text>{item.text}</Text>}
          renderItem={this.renderItem}
        />
            
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 40,
    width: 350, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});
