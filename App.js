import React, {Component} from 'react';
import {Alert, AppRegistry, Button, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import LinkPreview from 'react-native-link-preview';
import axios from 'react-native-axios';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      posts: [],
      title : "sample title"
    };
  }

  handleChange = (text) => {
    this.setState({text})
  }

  handleHapus = (key) => {
    var posts = this.state.posts
    var newPost = []
    for (i=0; i<posts.length; i++){
      if (key != i){
        newPost.push(posts[i])
      }
    }
    this.setState(
      {
        posts : newPost
      }    
    )
    console.log(key)
    axios.delete('http://192.168.1.17:8081/mysql/'+key)
    .then(function (response) {
      alert(response.data)
      console.log(response);

    })
    .catch(function (error) {
      alert(error.message)
      console.log(error);
    }); 
  }
  
  handlePress = () => {
    var regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
    if (this.state.text == ""){
      alert('require input')
    }
    else if (this.state.text.match(regex)) {
      LinkPreview.getPreview(this.state.text)
      .then(data => {
        this.setState(
          {
            posts:
            [
              {
                //text:this.state.text,
                title:data.title, 
                img:data.images[0],
                dsc:data.description,
                post:this.state.text
              },
              ...this.state.posts
            ],
            text:''
          }
        );
        axios.post('http://192.168.1.17:8081/mysql', 
          {test:'aa'}
        )
        .then(function (response) {
          alert(response.data)
          console.log(response);

        })
        .catch(function (error) {
          alert(error.message)
          console.log(error);
        });
      });
    }
    else {
      this.setState(
        {
          posts:[{text:this.state.text},...this.state.posts],
          text:''
        }
      )
    }  
  }

   componentDidMount () {
    axios.get("http://192.168.1.17:8081/mysql")
      .then (response => {
        this.setState({
          posts: response.data
        })
      })
      .catch(error => {
        console.log('err', error)
      }); 
  }

  renderItem = ({ item, index }) => {
    console.log(item)
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View
        style={styles.item}
      >
        <Text style={styles.itemText}>{item.text}</Text>
        <Text style={styles.itemText}>{item.title}</Text>
        <Image source={{uri:item.img}} style={{width:100, height:100}}/>
        <Text>{item.dsc}</Text>
        <Button
          onPress={() => this.handleHapus(index)}
          title="x"
        />
      </View>
    );
  };

  render() {
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
          data={this.state.posts}
          renderItem={this.renderItem}
          keyExtractor = {(item,index) => item.id.toString()}
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
    height:200,
    width: 350, 
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});


//pake if buat regex buat detect url
//nulis tentang mongodb
//ganti db nya jadi mongodb:
//pake mysql bisa create & read. RN <-> Express <-> Mysql
//key extractor buat delete. pake iterasi.

//bulan ini crud