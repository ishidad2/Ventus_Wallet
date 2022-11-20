const symbol = require('/node_modules/symbol-sdk');

//const GENERATION_HASH = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
const EPOCH = 1615853185;
const XYM_ID = '6BED913FA20223F8';
const NODE_URL = 'https://symbol-mikun.net:3001';
const NET_TYPE = symbol.NetworkType.MAIN_NET;

const repositoryFactory = new symbol.RepositoryFactoryHttp(NODE_URL);       // RepositoryFactoryはSymbol-SDKで提供されるアカウントやモザイク等の機能を提供するRepositoryを作成するためのもの
const accountHttp = repositoryFactory.createAccountRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const mosaicHttp = repositoryFactory.createMosaicRepository();


setTimeout(() => {
  
const address = symbol.Address.createFromRawAddress(window.SSS.activeAddress);

const dom_addr = document.getElementById('wallet-addr');
dom_addr.innerText = address.pretty();                                       // address.pretty() アドレスがハイフンで区切られた文字列で表示され見やすくなる

accountHttp.getAccountInfo(address)
  .toPromise()
  .then((accountInfo) => {
    for (let m of accountInfo.mosaics) {
      if (m.id.id.toHex() === XYM_ID) {
        const dom_xym = document.getElementById('wallet-xym')
        dom_xym.innerText = `XYM Balance : ${m.amount.compact() / Math.pow(10, 6)}`
      }
    }
  })
 
    //　リスナーでトランザクションを検知し、音を鳴らす
  
 
  nsRepo = repositoryFactory.createNamespaceRepository();
  
  wsEndpoint = NODE_URL.replace('http', 'ws') + "/ws";
  listener = new symbol.Listener(wsEndpoint,nsRepo,WebSocket);
  
  
  listener.open().then(() => {

    //Websocketが切断される事なく、常時監視するために、ブロック生成(約30秒毎)の検知を行う

    //ブロック生成の検知
    listener.newBlock()
    .subscribe(block=>{
      console.log(block);
    });
    
    //承認トランザクションの検知
    listener.confirmed(address)
    .subscribe(tx=>{
        //受信後の処理を記述
        console.log(tx);
         // 承認音を鳴らす   
        var my_audio = new Audio("https://github.com/symbol/desktop-wallet/raw/dev/src/views/resources/audio/ding2.ogg");
        my_audio.currentTime = 0;  //再生開始位置を先頭に戻す      
        my_audio.play();  //サウンドを再生
        window.setTimeout(function(){location.reload();},2000); // 2秒後にページをリロード
    });

    //未承認トランザクションの検知
    listener.unconfirmedAdded(address)
    .subscribe(tx=>{
        //受信後の処理を記述
        console.log(tx);
      　　// 未承認トランザクション音を鳴らす
        var my_audio = new Audio("https://github.com/symbol/desktop-wallet/raw/dev/src/views/resources/audio/ding.ogg");
        my_audio.currentTime = 0;  //再生開始位置を先頭に戻す
        my_audio.play();  //サウンドを再生   
    });   
  });
  
  
  // ////////////////////////
  
                                  // トランザクション履歴を取得する
const searchCriteria = {                                   
  group: symbol.TransactionGroup.Confirmed,
  address,
  pageNumber: 1,
  pageSize: 20,
  order: symbol.Order.Desc,
};

console.log("searchCriteria=");  //////////////////
console.log(searchCriteria);    //////////////////
  
console.log("transactionHttp=");/////////////////
console.log(transactionHttp);   //////////////////

transactionHttp
  .search(searchCriteria)
  .toPromise()
  .then((txs) => {
    console.log("txs=");         /////////////////
    console.log(txs);           /////////////////
    const dom_txInfo = document.getElementById('wallet-transactions');
    
    console.log("dom_txInfo="); ////////////////
    console.log(dom_txInfo);    ////////////////
    
    for (let tx of txs.data) {   //    配列をループ処理
      console.log("tx=");      ////////////////////
      console.log(tx);
      const dom_tx = document.createElement('div');
      const dom_date = document.createElement('div');
      const dom_txType = document.createElement('div');
      const dom_hash = document.createElement('div');
      const dom_signer_address = document.createElement('div');
      const dom_recipient_address = document.createElement('div');
      const dom_mosaic = document.createElement('div');
      const dom_amount = document.createElement('div');
      const dom_message = document.createElement('div');
     

      dom_txType.innerHTML = `<font color="#2f4f4f">Tx Type : ${getTransactionType(tx.type)}</font>`;        //　文字列の結合 　Tx タイプ
      dom_hash.innerHTML = `<font color="#2f4f4f">Tx Hash : </font><a href="https://symbol.fyi/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><small>${tx.transactionInfo.hash}</small></a>`; //Tx hash
      dom_signer_address.innerHTML = `<font color="#2f4f4f">From : ${tx.signer.address.address}</font>`;    //  文字列の結合　送信者
      
      
      
      　　　console.log("timestamp=");                                                ///////////　　  　timestamp to Date 　　　　　　　//////////
      　　　const timestamp = EPOCH + (parseInt(tx.transactionInfo.timestamp.toHex(), 16)/1000);   /////////////// Unit64 を 16進数に　変換したあと10進数に変換　
      　　　const date = new Date(timestamp * 1000);
      　　　console.log(date.getTime());
      
     　　　 const yyyy = `${date.getFullYear()}`;
      　　　// .slice(-2)で文字列中の末尾の2文字を取得する
      　　　// `0${date.getHoge()}`.slice(-2) と書くことで０埋めをする
      　　　const MM = `0${date.getMonth() + 1}`.slice(-2); // getMonth()の返り値は0が基点
      　　　const dd = `0${date.getDate()}`.slice(-2);
      　　　const HH = `0${date.getHours()}`.slice(-2);
      　　　const mm = `0${date.getMinutes()}`.slice(-2);
      　　　const ss = `0${date.getSeconds()}`.slice(-2);

　　　      const ymdhms = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}　　　`;
      
     　　　 console.log(ymdhms);
      
     　　　 dom_date.innerHTML = `<font color="#7E00FF"><p style="text-align: right">${ymdhms}</p></font>`;    //　日付  右寄せ
      
     　　　 dom_tx.appendChild(dom_date);                     //　dom_date　をdom_txに追加
        
           dom_tx.appendChild(dom_txType);                    // dom_txType をdom_txに追加 
           dom_tx.appendChild(dom_hash);                      // dom_hash をdom_txに追加
           dom_tx.appendChild(dom_signer_address);            // dom_signer_address をdom_txに追加  
      
     //  if (tx.type === 16724) {  // トランザクションが Transfer の場合
         
         dom_recipient_address.innerHTML = `<font color="#2f4f4f">To :   ${tx.recipientAddress.address}</font>`; //  文字列の結合　宛先
        
      
        if (tx.mosaics.length !== 0){   //モザイクが空でない場合 Namespaceを取得する
         (async() => {
          mosaicNames_ = await nsRepo.getMosaicsNames([new symbol.MosaicId(tx.mosaics[0].id.id.toHex())]).toPromise();
          })();  
        }
         
          console.log(mosaicNames_);
      
         if(tx.signer.address.address === address.address) {  // 送信アドレスとウォレットのアドレスが同じかどうかで表示を変える
           if (tx.mosaics.length === 0){   //モザイクが空の場合
              dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : No mosaic</font>`;     // No mosaic
              dom_amount.innerHTML = `<font color="#FF0000">🥳➡️💰 : </font>`;     // 　数量 
           }else {
              dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : ${tx.mosaics[0].id.id.toHex()}(${mosaicNames_[0][0].names[0].name}) </font>`; 
              dom_amount.innerHTML = `<font color="#FF0000">🥳➡️💰 : ${tx.mosaics[0].amount.lower/1000000} </font>`;     // 　数量 
           }   
         }else {
           if (tx.mosaics.length === 0){   //モザイクが空の場合
              dom_mosaic.innerHTML = `<font color="#008000">Mosaic : No mosaic</font>`;     // No mosaic
              dom_amount.innerHTML = `<font color="#008000">💰➡️🥳 : </font>`;     // 　数量 
           }else {
              dom_mosaic.innerHTML = `<font color="#008000">Mosaic : ${tx.mosaics[0].id.id.toHex()}(${mosaicNames_[0][0].names[0].name}) </font>`; 
              dom_amount.innerHTML = `<font color="#008000">💰➡️🥳 : ${tx.mosaics[0].amount.lower/1000000} </font>`;     // 　数量 
           }
         }
        
         
         dom_message.innerHTML = `<font color="#2f4f4f">Message : ${tx.message.payload}</font>`;     // 　メッセージ 
       
        //  if (tx.mosaics[0].id.id.toHex() === "6BED913FA20223F8") { //XYMモザイクの時だけ  
            dom_tx.appendChild(dom_recipient_address);         // dom_recipient_address をdom_txに追加
            dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
            dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
            dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加              
        //  }
         
           
     //  }
       dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
       dom_txInfo.appendChild(dom_tx);                    // トランザクション情報を追加
    }
  })
}, 3000)


// Transaction Type を返す関数
function getTransactionType (type) { // https://symbol.github.io/symbol-sdk-typescript-javascript/1.0.3/enums/TransactionType.html
  switch(type){
  　case 16720:
    　return 'ACCOUNT_ADDRESS_RESTRICTION';
    　break;
  　case 16716:
    　return 'ACCOUNT_KEY_LINK';
    　break;  
    case 16708:
    　return 'ACCOUNT_METADATA';
    　break;
    case 16976:
    　return 'ACCOUNT_MOSAIC_RESTRICTION';
    　break;
    case 17232:
    　return 'ACCOUNT_OPERATION_RESTRICTION';
    　break;
    case 16974:
    　return 'ADDRESS_ALIAS';
    　break;
    case 16961:
    　return 'AGGREGATE_BONDED';
    　break;
    case 16705:
    　return 'AGGREGATE_COMPLETE';
    　break;
    case 16712:
    　return 'HASH_LOCK';
    　break;
    case 16977:
    　return 'MOSAIC_ADDRESS_RESTRICTION';
    　break;
    case 17230:
    　return 'MOSAIC_ALIAS';
    　break;
    case 16717:
    　return 'MOSAIC_DEFINITION';
    　break;
    case 16721:
    　return 'MOSAIC_GLOBAL_RESTRICTION';
    　break;
    case 16964:
    　return 'MOSAIC_METADATA';
    　break;
    case 16973:
    　return 'MOSAIC_SUPPLY_CHANGE';
    　break;
    case 17229:
    　return 'MOSAIC_SUPPLY_REVOCATION';
    　break;
    case 16725:
    　return 'MULTISIG_ACCOUNT_MODIFICATION';
    　break;
    case 17220:
    　return 'NAMESPACE_METADATA';
    　break;
    case 16718:
    　return 'NAMESPACE_REGISTRATION';
    　break;
    case 16972:
    　return 'NODE_KEY_LINK';
    　break;
    case 0:
    　return 'RESERVED';
    　break;
    case 16722:
    　return 'SECRET_LOCK';
    　break;
    case 16978:
    　return 'SECRET_PROOF';
    　break;
    case 16724:
    　return 'TRANSFER';
    　break;
    case 16707:
    　return 'VOTING_KEY_LINK';
    　break;
    case 16963:
    　return 'VRF_KEY_LINK';
    　break;  
    default:
  　　return 'Other';
  }
}

// handleSSS関数はトランザクションを作成し、window.SSS.setTransaction関数を実行しSSSにトランザクションを登録します。そしてwindow.SSS.requestSign関数を実行し、SSSを用いた署名をユーザ－に要求します。

function handleSSS() {
  console.log('handle sss');
  const addr = document.getElementById('form-addr').value;
  const amount = document.getElementById('form-amount').value;
  const message = document.getElementById('form-message').value;
  
  const tx = symbol.TransferTransaction.create(        // トランザクションを生成
    symbol.Deadline.create(EPOCH),
    symbol.Address.createFromRawAddress(addr),
    [
      new symbol.Mosaic(
        new symbol.MosaicId(XYM_ID),
        symbol.UInt64.fromUint(Number(amount)*1000000)
      )
    ],
    symbol.PlainMessage.create(message),
    NET_TYPE,
    symbol.UInt64.fromUint(100000)
  )

  window.SSS.setTransaction(tx);               // SSSにトランザクションを登録

  window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
    console.log('signedTx', signedTx);
    transactionHttp.announce(signedTx);
    
    
  })
}
