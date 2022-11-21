const symbol = require('/node_modules/symbol-sdk');

//const GENERATION_HASH = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

//MAIN_NET の場合

const EPOCH_M = 1615853185;
const NODE_URL_M = 'https://symbol-mikun.net:3001';
const NET_TYPE_M = symbol.NetworkType.MAIN_NET;
const XYM_ID_M = '6BED913FA20223F8'; 

const repositoryFactory_M = new symbol.RepositoryFactoryHttp(NODE_URL_M);       // RepositoryFactoryはSymbol-SDKで提供されるアカウントやモザイク等の機能を提供するRepositoryを作成するためのもの
const accountHttp_M = repositoryFactory_M.createAccountRepository();
const transactionHttp_M = repositoryFactory_M.createTransactionRepository();
const mosaicHttp_M = repositoryFactory_M.createMosaicRepository();
const nsRepo_M = repositoryFactory_M.createNamespaceRepository();

//TEST_NET の場合

const EPOCH_T = 1667250467;
const NODE_URL_T = 'https://mikun-testnet.tk:3001';
const NET_TYPE_T = symbol.NetworkType.TEST_NET;
const XYM_ID_T = '72C0212E67A08BCE';

const repositoryFactory_T = new symbol.RepositoryFactoryHttp(NODE_URL_T);       // RepositoryFactoryはSymbol-SDKで提供されるアカウントやモザイク等の機能を提供するRepositoryを作成するためのもの
const accountHttp_T = repositoryFactory_T.createAccountRepository();
const transactionHttp_T = repositoryFactory_T.createTransactionRepository();
const mosaicHttp_T = repositoryFactory_T.createMosaicRepository();
const nsRepo_T = repositoryFactory_T.createNamespaceRepository();

let EPOCH;
let NODE_URL;
let NET_TYPE;
let XYM_ID;
     
let repositoryFactory;
let accountHttp;
let transactionHttp;
let mosaicHttp;
let nsRepo;



setTimeout(() => {    //指定した時間後に一度だけ動作する
  
const address = symbol.Address.createFromRawAddress(window.SSS.activeAddress);
//const address = symbol.Address.createFromRawAddress("TANWG4F32RMJT6UEKA2COQPJERCDLHB34RIGBII"); // テストネット　　テスト
  
  console.log("activeAddress=");
  console.log(address.address);
  
const check_netType = address.address.charAt(0);     

   if (check_netType === 'N'){           //ネットワークの判別　Nはメインネット / Tはテストネット
       EPOCH = EPOCH_M;
       NODE_URL = NODE_URL_M;
       NET_TYPE = NET_TYPE_M;
       XYM_ID = XYM_ID_M;
     
       repositoryFactory = repositoryFactory_M;
       accountHttp = accountHttp_M;
       transactionHttp = transactionHttp_M;
       mosaicHttp = mosaicHttp_M;
       nsRepo = nsRepo_M;
       
      console.log("MAIN_NET");
   }else 
      if (check_netType === 'T'){
          EPOCH = EPOCH_T;
          NODE_URL = NODE_URL_T;
          NET_TYPE = NET_TYPE_T;
          XYM_ID = XYM_ID_T;
        
          repositoryFactory = repositoryFactory_T;
          accountHttp = accountHttp_T;
          transactionHttp = transactionHttp_T;
          mosaicHttp = mosaicHttp_T;
          nsRepo = nsRepo_T;
        
          console.log("TEST_NET");
      }
       console.log("check_netType=");
       console.log(check_netType);
  
       
         

const dom_netType = document.getElementById('netType');
     
  if (NET_TYPE === NET_TYPE_M){   
     dom_netType.innerHTML = '<font color="0000cd">< MAIN_NET Address ></font>'
  }else
     if (NET_TYPE === NET_TYPE_T){
        dom_netType.innerHTML = '<font color="#ff8c00">< TEST_NET Address ></font>'
  }    
     
const dom_addr = document.getElementById('wallet-addr');
//dom_addr.innerText = address.pretty();                         // address.pretty() アドレスがハイフンで区切られた文字列で表示される
dom_addr.innerText = address.address;                            // ハイフン無しでアドレスを表示
  
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
  
 
 // nsRepo = repositoryFactory.createNamespaceRepository();
  
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
  pageSize: 10,
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
      
    if (check_netType === 'N'){   // MAINNET の場合
      dom_hash.innerHTML = `<font color="#2f4f4f">Tx Hash : </font><a href="https://symbol.fyi/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><small>${tx.transactionInfo.hash}</small></a>`; //Tx hash
    }else
       if (check_netType === 'T'){ // TESTNET の場合
           dom_hash.innerHTML = `<font color="#2f4f4f">Tx Hash : </font><a href="https://testnet.symbol.fyi/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><small>${tx.transactionInfo.hash}</small></a>`; //Tx hash
       }
         
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
      
 
        if (tx.type !== 16961 && tx.type !== 16705){ // 'AGGREGATE_BONDED' 'AGGREGATE_COMPLETE' の時はスルーする
           dom_recipient_address.innerHTML = `<font color="#2f4f4f">To :   ${tx.recipientAddress.address}</font>`; //  文字列の結合　宛先
             
          if (tx.mosaics.length !== 0){ //モザイクが空でない(モザイク有りの場合)
            (async() => {
             const mosaicNames = await nsRepo.getMosaicsNames([new symbol.MosaicId(tx.mosaics[0].id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
          
             mosaicInfo = await mosaicHttp.getMosaic(tx.mosaics[0].id.id).toPromise();// 可分性の情報を取得する
             console.log(mosaicInfo.divisibility);
             console.log(mosaicNames);
          
             const div = mosaicInfo.divisibility; // 可分性
      
            if(tx.signer.address.address === address.address) {  // 送信アドレスとウォレットのアドレスが同じかどうかで絵文字の表示と色を変える           
                 dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :  ${[mosaicNames][0][0].names[0].name}  (${tx.mosaics[0].id.id.toHex()})</font>`; 
                 dom_amount.innerHTML = `<font color="#FF0000">💁‍♀️➡️💰 : ${parseInt(tx.mosaics[0].amount.toHex(), 16)/(10**div)} </font>`;     // 　数量               
            }else {         
                 dom_mosaic.innerHTML = `<font color="#008000">Mosaic :  ${[mosaicNames][0][0].names[0].name}  (${tx.mosaics[0].id.id.toHex()})</font>`; 
                 dom_amount.innerHTML = `<font color="#008000">💰➡️🥳 : ${parseInt(tx.mosaics[0].amount.toHex(), 16)/(10**div)} </font>`;     // 　数量            
            }
        
            })(); // async()
          }else { //モザイクが空の場合
             if(tx.signer.address.address === address.address) {  // 送信アドレスとウォレットのアドレスが同じかどうかで絵文字の表示と色を変える
               dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : No mosaic</font>`;     // No mosaic
               dom_amount.innerHTML = `<font color="#FF0000">💁‍♀️➡️💰 : </font>`;     // 　数量 
             }else {
         　   　dom_mosaic.innerHTML = `<font color="#008000">Mosaic : No mosaic</font>`;     // No mosaic
               dom_amount.innerHTML = `<font color="#008000">💰➡️🥳 : </font>`;     // 　数量 
             }
           }
         
      
            dom_message.innerHTML = `<font color="#2f4f4f">Message : ${tx.message.payload}</font>`;     // 　メッセージ 
         }
        
            dom_tx.appendChild(dom_recipient_address);         // dom_recipient_address をdom_txに追加
            dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
            dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
            dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加              
  
            dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            dom_txInfo.appendChild(dom_tx);                    // トランザクション情報を追加
    }
  })
}, 500)


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
     
     console.log("addr=");
     console.log(addr);
     
     if (addr.charAt(0) === 'N'){  // MAINNET の場合 
         EPOCH = EPOCH_M; 
         XYM_ID = XYM_ID_M;
         NET_TYPE = NET_TYPE_M;
         transactionHttp = transactionHttp_M;
     }else
        if (addr.charAt(0) === 'T'){ //TESTNET の場合
            EPOCH = EPOCH_T; 
            XYM_ID = XYM_ID_T;
            NET_TYPE = NET_TYPE_T
            transactionHttp = transactionHttp_T;
        }
             
  
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
