// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract DappTube {
  
  string public name = "DappTube";
 
 //Estrutura do Vídeo
  struct Video {
    uint id;
    string hash;
    string title;
    address author;
    uint256 likes;
  }
  //Declaração de evento
  event VideoUploaded(    
    string hash,
    string title,
    address author,
    uint256 likes
  );
  //Declaração de evento
  event Likes(
    uint256 likes
  );

  //Array de vídeos
  Video[] public Videos; 

  //Variáveis de estado
  address public admin;
  address public contractAddress;

  constructor(){
    admin = msg.sender;
    contractAddress = address(this);
  }

  //Executa o upload do vídeo
  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Certifique-se de que o hash do vídeo existe
    require(bytes(_videoHash).length > 0);
    // Verifique se o título do vídeo existe
    require(bytes(_title).length > 0);
    // Verifique se o endereço do uploader existe
    require(msg.sender!=address(0));   

    uint _id = Videos.length;

    // Adicionar vídeo ao contrato
    Videos.push(Video(_id, _videoHash, _title, msg.sender,0));

    // Acionar um evento
    emit VideoUploaded(_videoHash, _title, msg.sender,0);
  }

  
    // Obter todos os vídeos
  function get_All_Videos() view public returns (Video[] memory){
        return Videos;
  }
  
  //Atualizar o número de likes
  function setLikes(uint256 _indice) public {
    Videos[_indice].likes +=1;
    emit Likes(Videos[_indice].likes);
  }

}