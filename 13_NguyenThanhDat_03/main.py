from flask import Flask, request, jsonify, render_template
import json
import sqlite3

app = Flask(__name__)

DATABASE = 'ShoppingDB.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/Supplier', methods=['GET'])
def get_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Supplier")
    supplier = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in supplier])

@app.route('/Supplier', methods=['DELETE'])
def delete_supplier():
    try:
        data = request.get_json()
        supplier_id = data.get('SupplierID')

        if supplier_id is None:
            return jsonify({'error': 'Missing SupplierID'}), 400

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Supplier WHERE SupplierID = ?", (supplier_id,))
        conn.commit()
        conn.close()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Supplier not found'}), 404
        else:
            return jsonify({'message': f'Supplier with ID {supplier_id} deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/Supplier', methods=['POST'])
def add_supplier():
    try:
        data = request.get_json()

        required_fields = ['SupplierName', 'EmailAddress', 'Password', 'Tel', 'TotalEmployee']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO Supplier (SupplierName, EmailAddress, Password, Tel, TotalEmployee)
            VALUES ( ?, ?, ?, ?, ?)
        ''', (data['SupplierName'], data['EmailAddress'], data['Password'], data['Tel'], data['TotalEmployee']))

        conn.commit()
        new_supplier_id = cursor.lastrowid  
        conn.close()
        return jsonify({'message': 'Supplier added successfully', 'SupplierID': new_supplier_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/Supplier', methods=['PUT'])
def update_supplier():
    try:
        data = request.get_json()
        supplier_id = data.get('SupplierID')

        if supplier_id is None:
            return jsonify({'error': 'Missing SupplierID'}), 400

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE Supplier
            SET SupplierName = ?, EmailAddress = ?, Password = ?, Tel = ?, TotalEmployee = ?
            WHERE SupplierID = ?
        ''', (data['SupplierName'], data['EmailAddress'], data['Password'], data['Tel'], data['TotalEmployee'], supplier_id))

        conn.commit()
        conn.close()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Supplier not found'}), 404
        else:
            return jsonify({'message': f'Supplier with ID {supplier_id} updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/check_supplier', methods=['POST'])
def check_supplier_credentials():
    try:
        # Lấy dữ liệu từ body JSON
        data = request.get_json()

        # Kiểm tra sự tồn tại của EmailAddress và Password
        if 'EmailAddress' not in data or 'Password' not in data:
            return jsonify({'error': 'Missing EmailAddress or Password'}), 400

        email = data['EmailAddress']
        password = data['Password']

        # Tạo kết nối và truy vấn CSDL
        conn = get_db()
        cursor = conn.cursor()

        # Truy vấn để kiểm tra xem Supplier có tồn tại với email và password này không
        cursor.execute("SELECT * FROM Supplier WHERE EmailAddress = ? AND Password = ?", (email, password))
        supplier = cursor.fetchone()
        conn.close()

        # Kiểm tra kết quả trả về
        if supplier:
            # Nếu có Supplier, trả về thông tin Supplier
            return jsonify({
                'message': 'Supplier found',
                'SupplierID': supplier['SupplierID'],
                'SupplierName': supplier['SupplierName'],
                'EmailAddress': supplier['EmailAddress'],
                'TotalEmployee': supplier['TotalEmployee']
            }), 200
        else:
            # Nếu không tìm thấy Supplier
            return jsonify({'message': 'Supplier not found or incorrect credentials'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search_supplier', methods=['POST'])
def search_supplier():
    try:
        # Lấy dữ liệu từ body JSON
        data = request.get_json()

        # Kiểm tra sự tồn tại của chuỗi tìm kiếm
        if 'search_string' not in data:
            return jsonify({'error': 'Missing search string'}), 400

        search_string = data['search_string']

        # Tạo kết nối và truy vấn CSDL
        conn = get_db()
        cursor = conn.cursor()

        query = '''
            SELECT * FROM Supplier
            WHERE SupplierName LIKE ? OR EmailAddress LIKE ? OR AccountName LIKE ?
        '''
        like_search = f"%{search_string}%"
        cursor.execute(query, (like_search, like_search, like_search))

        # Lấy tất cả các bản ghi phù hợp
        suppliers = cursor.fetchall()
        conn.close()

        if suppliers:
            # Trả về danh sách các Supplier tìm được
            result = []
            for supplier in suppliers:
                result.append({
                    'SupplierID': supplier['SupplierID'],
                    'SupplierName': supplier['SupplierName'],
                    'AccountName': supplier['AccountName'],
                    'EmailAddress': supplier['EmailAddress'],
                    'TotalEmployee': supplier['TotalEmployee']
                })
            return jsonify({'message': 'Suppliers found', 'suppliers': result}), 200
        else:
            # Trả về thông báo nếu không tìm thấy bản ghi nào
            return jsonify({'message': 'No suppliers found matching the search criteria'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/supplier_products', methods=['POST'])
def get_supplier_products():
    try:
        # Lấy dữ liệu từ body JSON
        data = request.get_json()

        # Kiểm tra sự tồn tại của SupplierID
        if 'SupplierID' not in data:
            return jsonify({'error': 'Missing SupplierID'}), 400

        supplier_id = data['SupplierID']

        # Tạo kết nối và truy vấn CSDL để lấy sản phẩm theo SupplierID
        conn = get_db()
        cursor = conn.cursor()

        # Truy vấn sản phẩm của Supplier theo SupplierID
        query = '''
            SELECT * FROM Product
            WHERE SupplierID = ?
        '''
        cursor.execute(query, (supplier_id,))
        products = cursor.fetchall()
        conn.close()

        if products:
            # Trả về danh sách sản phẩm
            result = []
            for product in products:
                result.append({
                    'ProductID': product['ProductID'],
                    'ProductName': product['ProductName'],
                    'Price': product['Price'],
                    'StockQuantity': product['StockQuantity'],
                    'SupplierID': product['SupplierID']
                })
            return jsonify({'message': 'Products found', 'products': result}), 200
        else:
            # Nếu không có sản phẩm nào của SupplierID này
            return jsonify({'message': 'No products found for this SupplierID'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add_suppliers', methods=['POST'])
def add_multiple_suppliers():
    try:
        # Lấy dữ liệu từ body JSON
        data = request.get_json()

        # Kiểm tra nếu danh sách nhà cung cấp không có hoặc trống
        if not isinstance(data, list) or len(data) == 0:
            return jsonify({'error': 'Invalid or empty suppliers list'}), 400

        # Tạo kết nối tới CSDL
        conn = get_db()
        cursor = conn.cursor()

        # Câu lệnh INSERT vào bảng Supplier
        insert_query = '''
            INSERT INTO Supplier (SupplierName, AccountName, EmailAddress, Password, Tel, TotalEmployee)
            VALUES (?, ?, ?, ?, ?, ?)
        '''

        # Duyệt qua từng nhà cung cấp và thêm vào CSDL
        for supplier in data:
            if not all(key in supplier for key in ['SupplierName', 'AccountName', 'EmailAddress', 'Password', 'Tel', 'TotalEmployee']):
                return jsonify({'error': 'Missing required field in supplier'}), 400

            cursor.execute(insert_query, (
                supplier['SupplierName'],
                supplier['AccountName'],
                supplier['EmailAddress'],
                supplier['Password'],
                supplier['Tel'],
                supplier['TotalEmployee']
            ))

        # Commit và đóng kết nối
        conn.commit()
        conn.close()

        # Trả về thông báo thành công
        return jsonify({'message': f'{len(data)} suppliers added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)