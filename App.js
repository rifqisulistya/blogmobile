import React, {Component} from 'react';
import {Alert, AppRegistry, Button, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import LinkPreview from 'react-native-link-preview';
import axios from 'react-native-axios';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      posts: [],
      title : "sample title",
      editMode: null
    };
  }

  handleChange = (text) => {
    this.setState({text})
  }

  handleHapus = (key) => {
    var posts = this.state.posts
    var newPost = []
    for (i=0; i<posts.length; i++){
      if (key != posts[i].id){
        newPost.push(posts[i])
      }
    }
    this.setState(
      {
        posts : newPost
      }    
    )
    console.log('key:', key)
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
      console.log('masuk ke else if')
      LinkPreview.getPreview(this.state.text)
      .then(data => {
        console.log('masuk ke then')
        axios.post('http://192.168.1.17:8081/mysql', 
          {
            title:data.title, 
            img:data.images[0],
            dsc:data.description,
            post:this.state.text
          }
        )
        .then((response) => {
          alert(response.data)
          console.log(response);
          this.setState(
            {
              posts:
              [
                {
                  title:data.title, 
                  img:data.images[0],
                  dsc:data.description,
                  post:this.state.text,
                  id:response.data.id
                },
                ...this.state.posts
              ],
              text:''
            }
          );

        })
        .catch((error) => {
          alert(error.message)
          console.log(error);
        });
      });
    }
    else {
      console.log('masuk ke else')
      axios.post('http://192.168.1.17:8081/mysql', 
        {
          title:'', 
          img:'',
          dsc:'',
          post:this.state.text
        }
      )
      .then((response) => {
        alert(response.data)
        console.log(response);
        this.setState(
          {
            posts:
            [
              {
                title:'', 
                img:'',
                dsc:'',
                post:this.state.text,
                id:response.data.id
              },
              ...this.state.posts
            ],
            text:''
          }
        );

      })
      .catch((error) => {
        alert(error.message)
        console.log(error);
      });
    }  
  }

  handleLongPress = (item) => {
    this.setState(
      {
        text: item.post,
        editMode: item.id
      }
    )
    alert(this.state.text)
  }

  handleEdit = (id) => {
    var regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
    if (this.state.text == ""){
      alert('require input')
    }
    else if (this.state.text.match(regex)) {
      console.log('masuk ke else if')
      LinkPreview.getPreview(this.state.text)
      .then(data => {
        console.log('masuk ke then')
        axios.put('http://192.168.1.17:8081/mysql/'+id, 
          {
            title:data.title, 
            img:data.images[0],
            dsc:data.description,
            post:this.state.text
          }
        )
        .then((response) => {
          alert(response.data)
          console.log(response);
          var newPost = this.state.posts
          for (var i=0; i<newPost.length; i++) {
            if (newPost[i].id == id) {
              newPost[i] = {
                title:data.title, 
                img:data.images[0],
                dsc:data.description,
                post:this.state.text,
                id: id
              }  
            break
            }
          }
          this.setState(
            {
              posts : newPost,
              text: '',
              editMode: null
            }  
          )
        })
        .catch((error) => {
          alert(error.message)
          console.log(error);
        });
      });
    }
    else {
      axios.put('http://192.168.1.17:8081/mysql/'+id, 
          {
            title:'', 
            img:'',
            dsc:'',
            post:this.state.text
          }
        )
        .then((response) => {
          alert(response.data)
          console.log(response);
          var newPost = this.state.posts
          for (var i=0; i<newPost.length; i++) {
            if (newPost[i].id == id) {
              newPost[i] = {
                title:'', 
                img:'',
                dsc:'',
                post:this.state.text,
                id: id
              }  
            break
            }
          }
          this.setState(
            {
              posts : newPost,
              text: '',
              editMode: null
            }  
          )
        })
        .catch((error) => {
          alert(error.message)
          console.log(error);
        });
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

  renderImage = (param) => {
    if (param) {
      return (
        <Image source={{uri:param}} style={{width:100, height:100}}/>
      )
    }
  }

  renderItem = (obj) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onLongPress = {() => this.handleLongPress(obj.item)}
      >
        <Text style={styles.itemText}>{obj.item.post}</Text>
        <Text style={styles.itemText}>{obj.item.title}</Text>
        {this.renderImage(obj.item.img)}
        <Button
          onPress={() => this.handleHapus(obj.item.id)}
          title="x"
        />
      </TouchableOpacity>
    );
  };

  renderButton = () => {
    if (this.state.editMode) {
      return (
        <Button
          onPress={() => this.handleEdit(this.state.editMode)}
          title="Edit it!"
        />
      )  
    }
    return (
        <Button
          onPress={this.handlePress}
          title="Post it!"
        />
      )
  }

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
        {this.renderButton()}
        <FlatList
          data={this.state.posts}
          renderItem={(dasda) => this.renderItem(dasda)}
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
    height:300,
    width: 350, 
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

