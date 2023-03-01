import {ChangeEventHandler, MouseEventHandler, useCallback, useState} from 'react'
import './App.css'
import {decodeCalldata} from './utils/decoder.js';

function App() {
  const [calldata, setCalldata] = useState('0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000017200adb9ddfa24e326dc9d337561f6c7ba2a6ecec697000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000645e35359e00000000000000000000000027f3b2df4a81382202e87ee40429e0212ecc7d3f000000000000000000000000db583b636f995ef1ef28ac96b9ba235916bd158300000000000000000000000000000000000000000000007ee69a19185977e7c900adb9ddfa24e326dc9d337561f6c7ba2a6ecec697000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000645e35359e000000000000000000000000cf664087a5bb0237a0bad6742852ec6c8d69a27a000000000000000000000000db583b636f995ef1ef28ac96b9ba235916bd1583000000000000000000000000000000000000000000000077e1773b839247229a0000000000000000000000000000');
  const [output, setOutput] = useState('');
  const handleCalldataChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setCalldata(e.target.value);
  }, [setCalldata]);

  const handleDecode = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const decoded = decodeCalldata(calldata);
    setOutput(decoded ?? '');
  }, [calldata, setOutput]);

  return (
    <div className="grid">
      <div className="textColumn">
        <h1>Calldata</h1>
        <textarea value={calldata} onChange={handleCalldataChange} cols={120} rows={60}/>
      </div>
      <div className="buttonColumn">
        <button onClick={handleDecode}>Decode</button>
      </div>
      <div className="textColumn">
        <h1>Transactions</h1>
        <textarea value={output} cols={120} rows={60}/>
      </div>
    </div>
  )
}

export default App
