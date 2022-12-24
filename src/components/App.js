import React from "react";
import FormData from 'form-data';
import axios from 'axios';
import web3 from './web3';
import myContract from './myContract';


class App extends React.Component{

    constructor(props){
    super(props);
    this.state = {
        file : null,
        ipfsHash: '',
        owner: '',
        contractAddress: '',
        videosList :  []       
    };
}

async componentDidMount() {
  
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];
  const contractAddress = await myContract.methods.contractAddress().call();
  const videosList = await myContract.methods.get_All_Videos().call();  
  
  this.setState({owner, contractAddress, videosList}); 
  
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      window.location.reload();
    } 
    });
  }		
}


async handleFile(fileToHandle){    

    console.log('começando')

    // inicializa o form data
    const formData = new FormData()

    // adiciona o arquivo ao form data 
    formData.append("file", fileToHandle)

    // armazena as chaves
    const API_KEY = "9f6052849e81cca8eee4"
    const API_SECRET = "1c35ddeb9ed231e7e610647f8d13bb74f52cf35bc36e3cc17ed96db5c9069534"

    // o endpoint necessário para upload o arquivo
    const url =  `https://api.pinata.cloud/pinning/pinFileToIPFS`

    const response = await axios.post(
      url,
      formData,
      {
          maxContentLength: "Infinity",
          headers: {
              "Content-Type": `multipart/form-data;boundary=${formData._boundary}`, 
              'pinata_api_key': API_KEY,
              'pinata_secret_api_key': API_SECRET

          }
      }
  )
  
  console.log(response)
  // obtem o hash
  const ipfsHash = response.data.IpfsHash;
  this.setState({ipfsHash});
  await myContract.methods.uploadVideo(ipfsHash, this.state.value).send({from: this.state.owner});
  window.location.reload();      
}

async setLike(_indice){	 
  this.setState({ message: 'Aguardando a execução da transação...'});  
  await myContract.methods.setLikes(_indice).send({from: this.state.owner});  
  this.setState({ message: 'Você deu um like'});
  window.location.reload();
}
    render() {
      return (
        <div className="App">
          <img width="150px" height="150px" src='DAppTube.png'></img>
          <span>Rede Social Descentralizada de Vídeos Curtos</span>
          <p></p>
          <span>&nbsp;&nbsp;&nbsp;Endereço do Contrato: {this.state.contractAddress}</span>
          <p></p>
          <p></p>
          <div>            
            <span role="img" aria-label="video-emote">
            &nbsp;&nbsp;&nbsp;&nbsp;Vídeos Curtos disponíveis 📺
            </span>
            <table border="1">
              <tbody>
              <tr>
                    <th>Vídeo</th>
                    <th>Título</th>
                    <th>Endereço do Autor</th>
                    <th>Likes</th>													
              </tr>
                {this.state.videosList.map(Video => (
                <tr key={Video.id}>                    
                    <td>             
                       <a
                    href={`https://gateway.pinata.cloud/ipfs/`+Video.hash}
                    target="_blank"
                    rel="noopener noreferrer"
                       ><video width="200px" height="110px" src={`https://gateway.pinata.cloud/ipfs/`+Video.hash}></video> 
                       </a>                          
                    </td>
                    <td>{Video.title}</td>
                    <td>{Video.author}</td>
                    <td>{Video.likes}<p onClick={() =>
                        this.setLike(Video.id)                        
                      }><img src="Like.png"></img></p>
                    </td>                      	                                                                  												
                </tr>
              ))
                }	
            </tbody>
            </table>
          </div>
          <p></p>
          <input type="file" onChange={(event)=>this.state.file = event.target.files[0]}/>
          <label> Digite o título: </label> 
          <input value = {this.state.value} onChange = {event => this.setState({value: event.target.value})} /> 
          &nbsp;   
              <button accept=".mp4, .mov, .mkv .ogg .wmv" onClick={() =>
                            this.handleFile(this.state.file)
              }>Enviar</button>                
    </div>
        
      );  
    } //fim render()
}
export default App;