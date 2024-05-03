import {
  RadixDappToolkit,
  DataRequestBuilder,
} from '@radixdlt/radix-dapp-toolkit'

const mynetworkId = 1;

console.log ("network ID", mynetworkId);

// UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES 
 
// change and or update the following definition with the value obtained during publish and initiate actions.
const dAppcomponent = 'component_rdx1crj2jm5l38rht0p9waqer3se3t4932gxxv2e7a40s3pf0h96ea66hp'
// change and update the folling definition with your own dApp-definitions wallet.
const dAppId = 'account_rdx12y7efa9556xfquf6mtn4rq2zmwt0nxsadl29gtfh822h5ag5tlysg6'
// change and update the following definition with the correct radix definition
const xrdAddress = 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd'

// UPDATES END 

const refreshButtonElement = document.getElementById("refreshwallet");
const depositButtonElement = document.getElementById("deposit");
depositButtonElement.textContent = "Refresh wallet first"
const keystoreButtonElement = document.getElementById("keystoreswap");
keystoreButtonElement.textContent = "Refresh wallet first"

const withdrawalButtonElement = document.getElementById("withdrawal");
withdrawalButtonElement.textContent = "Refresh wallet first"
const setdispenserButtonElement = document.getElementById("setdispenser");
setdispenserButtonElement.textContent = "Refresh wallet first"
const disabledispenserButtonElement = document.getElementById("disabledispenser");
disabledispenserButtonElement.textContent = "Refresh wallet first"



let delayBallance = 0
let clientAddress = "<undefined>"

const radixDappToolkit = RadixDappToolkit({
   dAppDefinitionAddress: dAppId,
   networkId: mynetworkId,
 });

radixDappToolkit.walletApi.setRequestData(
  DataRequestBuilder.persona(),
  DataRequestBuilder.accounts().exactly(1),
);

// refresh section
refreshButtonElement.addEventListener("click", async () => {

  const temp = radixDappToolkit.walletApi.getWalletData();
  if (temp.accounts.length != 0){
    clientAddress = temp.accounts[0].address; 
  } else{

    const result = await radixDappToolkit.walletApi.sendRequest()

    if (result.isErr()) return alert(JSON.stringify(result.error, null, 2));

    clientAddress = result.value.accounts[0].address;
  }

  const getDappDetails = await radixDappToolkit.gatewayApi.state.getEntityDetailsVaultAggregated(dAppcomponent);

  document.getElementById('componentname').innerText = getDappDetails.details.blueprint_name    
  document.getElementById('walletAddress').innerText = clientAddress  
  depositButtonElement.textContent = "Deposit"
  keystoreButtonElement.textContent = "KeyStore Swap"
  withdrawalButtonElement.textContent = "Withdrawal"
  setdispenserButtonElement.textContent = "Set Dispenser"
  disabledispenserButtonElement.textContent = "Disable Dispenser"
  


 });


// deposit section
depositButtonElement.addEventListener("click", async () => {
    const coinresource = document.getElementById('depositresource').value
    const amount = document.getElementById('depositamount').value
		let manifest = `
CALL_METHOD Address("${clientAddress}") "withdraw" Address("${coinresource}") Decimal("${amount}");
TAKE_FROM_WORKTOP Address("${coinresource}") Decimal("${amount}") Bucket("bucket");
CALL_METHOD Address("${dAppcomponent}") "deposit" Bucket("bucket");
`
    console.log (manifest)
	
    if (clientAddress == "<undefined>"){
      depositButtonElement.textContent = "Refresh wallet first"
    }else{
      const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
        transactionManifest: manifest,
        version: 1,
      });

      if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
    }
  }
);

// keystore section
keystoreButtonElement.addEventListener("click", async () => {
  const coinresource = document.getElementById('keystoreswapresource').value
  const proof = document.getElementById('keystoreproofresource').value
  let manifest = `
CALL_METHOD Address("${clientAddress}") "create_proof_of_amount" Address("${proof}") Decimal("1");
CALL_METHOD Address("${dAppcomponent}") "keystore_swap" Address("${coinresource}");
`
  console.log (manifest)

  if (clientAddress == "<undefined>"){
    keystoreButtonElement.textContent = "Refresh wallet first"
  }else{
    const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
  }
}
);

// witdrawal section
withdrawalButtonElement.addEventListener("click", async () => {
  const coinresource = document.getElementById('withdrawalresource').value
  const proof = document.getElementById('withdrawalproofresource').value
  let manifest = `
CALL_METHOD Address("${clientAddress}") "create_proof_of_amount" Address("${proof}") Decimal("1");
CALL_METHOD Address("${dAppcomponent}") "withdrawal" Address("${coinresource}");
CALL_METHOD Address("${clientAddress}") "deposit_batch" Expression("ENTIRE_WORKTOP");
`
  console.log (manifest)

  if (clientAddress == "<undefined>"){
    withdrawalButtonElement.textContent = "Refresh wallet first"
  }else{
    const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
  }
}
);

// setup dispenser section
setdispenserButtonElement.addEventListener("click", async () => {
  const incoinresource = document.getElementById('incommingsetresource').value
  const outcoinresource = document.getElementById('outgoingsetresource').value
  const outvsinratio = document.getElementById('outvsinratio').value
  const proof = document.getElementById('outvsinproofresource').value
  let manifest = `
CALL_METHOD Address("${clientAddress}") "create_proof_of_amount" Address("${proof}") Decimal("1");
CALL_METHOD Address("${dAppcomponent}") "set_redeem_pair" 
Address("${incoinresource}")
Address("${outcoinresource}")
Decimal("${outvsinratio}");
`
  console.log (manifest)

  if (clientAddress == "<undefined>"){
    setdispenserButtonElement.textContent = "Refresh wallet first"
  }else{
    const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
  }
}
);

// reset dispenser section
disabledispenserButtonElement.addEventListener("click", async () => {
  const proof = document.getElementById('disableproofresource').value
  let manifest = `
CALL_METHOD Address("${clientAddress}") "create_proof_of_amount" Address("${proof}") Decimal("1");
CALL_METHOD Address("${dAppcomponent}") "reset_dispenser" 
`
  console.log (manifest)

  if (clientAddress == "<undefined>"){
    disabledispenserButtonElement.textContent = "Refresh wallet first"
  }else{
    const TxDetails = await radixDappToolkit.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });
    if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
  }
}
);

