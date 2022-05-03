## Blockchain

    []: # Language: markdown
    []: # Path: block chain\be\README.md

### Block :

Attributes: timestamp, data, previous_hash, hash
Methods: **init**, **repr**, **str**, **eq**, **hash**, is_valid

Requirements:

Bài tập cá nhân về Blockchain:
Yêu cầu:

1. Ghi nhận quá trình làm việc lên Github (Source Code, Tài liệu tham khảo, Readme.txt)
2. Quay lại video cách sử dụng
   Xây dựng hệ thống tiền điện tử MyCoin :
3. Phần giao diện và quá trình thao tác tương tự https://www.myetherwallet.com/wallet/create
   a. Tạo Ví(Wallet)
   b. Xem thống kê tài khoản
   c. Gởi coin cho một địa chỉ khác
   d. Xem lịch sử giao dịch (https://etherscan.io/)
4. Sử dụng thuật toán Proof Of Work/Proof Of Stake/…

'''
To start run the following command:

- config env the first times:
  P2P_PORT= 5000
  HTTP_PORT = 3000

- the second times:
  P2P_PORT= 5001
  HTTP_PORT = 3001
  PEERS =ws://localhost:5000

- the third times:
  P2P_PORT= 5002
  HTTP_PORT = 3002
  PEERS =ws://localhost:5000,ws://localhost:5001

```

Tham khảo:
https://github.com/kashishkhullar/blockchain-nodejs
```
