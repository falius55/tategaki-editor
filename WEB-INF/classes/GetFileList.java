import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;
import java.net.*;

/**
 * @param user_id
 * @return fileid_list,filename_list
 * user_idをajaxから渡すことにより、ファイルのidとファイル名をそれぞれjson配列にして返します
 * POST通信
 */
public class GetFileList extends HttpServlet  {
	// インスタンス変数
	Connection conn = null;
	Statement stmt;
	// ====================================================================
	// 	jsp起動時の処理
	// ====================================================================
	// データベースへの接続
	public void init() {
		String url = "jdbc:mysql://localhost/blog_app";
		String user = "sampleuser";
		String password = "digk473";

		try {
			// 指定したクラスのインスタンスを作成してJDBCドライバをロードする
			Class.forName("com.mysql.jdbc.Driver").newInstance();

			// Drivermanagerに接続(データベースへの接続)
			conn = DriverManager.getConnection(url,user,password);


		} catch (ClassNotFoundException e) {
			log("ClassNotFoundException:" + e.getMessage());
		} catch (SQLException e) {
			log("SQLException:" + e.getMessage());
		} catch (Exception e) {
			log("Exception:" + e.getMessage());
		} 
	}
	// =====================================================================
	// 	jsp破棄時の処理
	// =====================================================================
	// ConnectionとStatementをcloseしている
	public void destroy(){
		try{
			if(conn != null){
				conn.close();
				stmt.close();
			}
		}catch(SQLException e){
			log("SQLException:" + e.getMessage());
		}
	}

	// =======================================================================
	// 	main
	// =======================================================================
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {

		try{
			// 返す値が1行だけならtext/plain
			// 複数ならapplication/json
			// response.setContentType("text/plain; charset=UTF-8");
			response.setContentType("application/json; charset=UTF-8");
			PrintWriter out = response.getWriter();

			// ======================================================
			//	 user_idから目的のユーザー名を取得
			// ======================================================
			String userId = request.getParameter("user_id");
			stmt = conn.createStatement();
			String sql = "SELECT * FROM edit_users where id = " + userId;
			//log("getuserName sql:" + sql);
			ResultSet rs = stmt.executeQuery(sql);
			String userName;

			rs.next();
			userName = rs.getString("name");

			// =====================================================
			// fileId一覧の作成
			// ====================================================
			sql = "SELECT * FROM file_table where written_by = \"" + userName + "\"";
			//log("create fileId sql:" + sql);
			rs = stmt.executeQuery(sql);
			StringBuffer sb = new StringBuffer();
			sb.append("{\"fileId_list\":[");
			String id;
			for(int i=0;rs.next();i++){
				id = rs.getString("id");
				if(i!=0)	sb.append(",");
				sb.append("\"");
				sb.append(id);
				sb.append("\"");
			}
			sb.append("],");

			// =====================================================
			// filename一覧の作成
			// ====================================================
			sql = "SELECT * FROM file_table where written_by = \"" + userName + "\"";
			//log("create filename sql:" + sql);
			rs = stmt.executeQuery(sql);
			sb.append("\"filename_list\":[");
			String filename;
			for(int i=0;rs.next();i++){
				filename = rs.getString("filename");
				if(i!=0)	sb.append(",");
				sb.append("\"");
				sb.append(filename);
				sb.append("\"");
			}
			sb.append("]}");

			// ===================================================
			//	 ajaxへ送信
			// ====================================================
			out.println(sb.toString());


			log("getFileList return is " + sb.toString());
			out.close();
		}catch(IOException e){
			log(e.getMessage());
		}catch(Exception e){
			log(e.getMessage());
		}
	}
}
