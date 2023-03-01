import {Interface, toBigInt} from 'ethers';
import {getNumber} from 'ethers';

const multicallInterface = new Interface([
  {
    'outputs': [],
    'type': 'function',
    'inputs': [
      {
        'internalType': 'bytes',
        'name': 'transactions',
        'type': 'bytes'
      }
    ],
    'name': 'multiSend',
    'stateMutability': 'payable'
  }
]);

export function decodeCalldata(calldata: string) {
  const tx = multicallInterface.parseTransaction({data: calldata});
  if (!tx) return null;
  if (!tx.fragment) return null;
  if (tx.fragment.name !== 'multiSend') return null;
  if (tx.args.length !== 1) return null;

  try {
    const txs = decodeTransactions(tx.args[0].substr(2));
    return JSON.stringify(txs, (key, input: any): string => {
      if (typeof input === 'bigint') {
        return input.toString(10);
      }
      return input;
    }, 2);
  }
  catch (e: any) {
    return e.message || '';
  }
}

/**
 * Decode transactions from bytes
 *
 * 00: 1 byte - operation type (0 - call, 1 - delegatecall, 2 - create)
 * 01: 20 bytes - address
 * 21: 32 bytes - value
 * 53: 32 bytes - data length
 * 85: data length bytes - data
 *
 * @param calldata
 */
function decodeTransactions(calldata: string) {
  const transactions = [];
  const reader = new BytesReader(calldata);

  while (!reader.eol) {
    const operation = reader.readUint8();
    const address = reader.readAddress();
    const value = reader.readUint256();
    const dataLength = reader.readUint256();
    const data = reader.readBytes(getNumber(dataLength));

    transactions.push({
      operation: operation,
      to: address,
      value,
      data,
    });
  }

  return transactions;
}

class BytesReader {
  private offset: number = 0;

  constructor(private readonly data: string) {
  }

  readBytes(count: number): string {
    if (this.eol) throw new Error('Unexpected end of data');

    const byte = this.data.substr(this.offset, 2 * count);
    this.offset += 2 * count
    return byte;
  }

  readAddress(): string {
    return `0x${this.readBytes(20)}`;
  }

  readUint8(): number {
    return parseInt(`0x${this.readBytes(1)}`, 16);
  }

  readUint256(): bigint {
    return toBigInt(`0x${this.readBytes(32)}`);
  }

  get eol(): boolean {
    return this.offset >= this.data.length;
  }
}