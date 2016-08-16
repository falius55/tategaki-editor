import java.io.PrintWriter;
import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ReadJsonFile extends AbstractServlet  {
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {

		try {
			ready(request,response);
			connectDatabase(/* url = */"jdbc:mysql://localhost/tategaki_editor", /* username = */"serveruser", /* password = */"digk473");

			//	idから目的のファイル名、最終更新日を取得
			int fileId = Integer.parseInt(request.getParameter("file_id"));
			executeSql("select * from file_table where id = ?").setInt(fileId).query();

			log("fileId"+ fileId);
			String fileName;
			String saved;
			if (next()) {
				fileName = getString("filename");
				saved = getDateFormat("saved");
			} else {
				log("no database data");
				throw new SQLException();	
			}

			StringBuffer sb = new StringBuffer();
			sb.append("{\"filename\":\"");
			sb.append(fileName);
			sb.append("\",");
			sb.append("\"saved\":\"");
			sb.append(saved);
			sb.append("\",");

			// userIdから、ルートディレクトリのidを取得
			int userId = Integer.parseInt(request.getParameter("user_id"));
			executeSql("select * from edit_users where id = ?").setInt(userId).query();
			int rootId;
			if (next()) {
				rootId = getInt("root_file_id");
			} else {
				throw new SQLException("database has no new data");	
			}

			//	ファイル読込
			sb.append("\"data\":");
			sb.append(readFile(String.format("data/%d/%d.json",rootId,fileId)));
			sb.append("}");

			//	ajaxへ送信
			String rtnJson = sb.toString().replaceAll("\"","\\\""); // jsonファイル中の"を\"にエスケープする
			out(rtnJson);

			log("fileName is " + fileName);
			log(rtnJson);
		} catch(SQLException e) {
			log(e.getMessage());
		} catch(Exception e) {
			log(e.getMessage());
		}
	}
}
