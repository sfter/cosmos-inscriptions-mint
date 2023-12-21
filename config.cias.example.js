// common
export const EXPLORER = "https://www.mintscan.io/celestia/tx";
export const RPC = "https://rpc.lunaroasis.net/";
export const NATIVE_PRICE_USD = 12.46;

// mint
export const GAS = 100000;
export const FEE_NATIVE = 0.01;
export const MINT_AMOUNT_NATIVE = 0.000001;
// MINT 次数，如果为 0 则会一直 Mint（但最大Mint最大次数由下面的 MAX_MINT_MINT 设置
export const MINT_COUNT = 0
// 最大 Mint 次数（默认为 10000）
export const MAX_MINT_COUNT = 10000
// 开始 Mint 的每轮周期起始-结束区块高度
export const BLOCK_HEIGHTS = [
    [55051600,55053100],
    [55094800,55096300],
    [55138000,55139500],
    [55182200,55182700],
    [55224400,55225900],
    [55267600,55269100],
    [55310800,55312300],
    [55354000,55355500]
]

export const SLEEP_ON_GET_ACCOUNT_ERROR_SEC = 20;
// 获取区块高度间出现错误时的间隔时间（以秒为单位）
export const SLEEP_ON_GET_HEIGHT_ERROR_SEC = 20;
// 检测区块高度间隔时间（以秒为单位）
export const SLEEP_ON_GET_HEIGHT_SEC = 1;
export const SLEEP_BETWEEN_START_ACCOUNTS_SEC = 5;
export const SLEEP_BETWEEN_ACCOUNT_TXS_SEC = 5;

// dispatch
export const SEND_NATIVE_TOKENS_PER_ACCOUNT = 0.4;
export const SLEEP_BETWEEN_DISPATCH_SEC = 30;

// withdraw
export const LEAVE_NATIVE_ON_ACCOUNT = 0.05;
export const SLEEP_BETWEEN_WITHDRAW_SEC = 5;
export const WITHDRAW_EXCHANGE_ADDRESS = "celestia....";

// balances
export const SLEEP_BETWEEN_CHECK_BALANCES_SEC = 30;

// transactions
export const SLEEP_BETWEEN_GET_TRANSACTIONS_SEC = 5;

// minted
export const SLEEP_BETWEEN_CHECK_MINTED_SEC = 5;

// system DO NOT EDIT system DO NOT EDIT system DO NOT EDIT system DO NOT EDIT system DO NOT EDIT
export const MINTED_API_URL = "https://www.cias.wtf/api/cias/cia-20/balance";
export const MEMO =
  "ZGF0YToseyJvcCI6Im1pbnQiLCJhbXQiOjEwMDAwLCJ0aWNrIjoiY2lhcyIsInAiOiJjaWEtMjAifQ==";
export const NATIVE_DENOM = "utia";
export const FILE_ACCOUNTS = "input/accounts.txt";
export const UNATIVE_PER_NATIVE = 10 ** 6;
export const NATIVE_TICK = "TIA";
export const ADDRESS_LENGTH = 47;
export const ADDRESS_PREFIX = "celestia";
// system DO NOT EDIT system DO NOT EDIT system DO NOT EDIT system DO NOT EDIT system DO NOT EDIT
