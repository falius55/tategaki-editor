import java.io.PrintWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.concurrent.CompletionException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * <p>ユーザーIDとファイルIDを受け取り、指定されたファイルを削除するサーブレット
 * <pre>
 * request: {
 * 	file_id
 * 	user_id
 * 	}
 * response: {
 * 	successRecord,
 * 	result
 * 	}
 * </pre>
 * successRecordは処理した行数、resultは削除に成功するとtrue
 */
public class DeleteFile extends AbstractServlet {
    private static final long serialVersionUID = 1L;

	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException {

        ready(request, response);

        int fileId = Integer.parseInt(request.getParameter("file_id"));
        int num = deleteFileFromDatabase(fileId);

        int userId = userId(request);
        int rootId = rootId(userId);

        boolean b = deleteFile(String.format("data/%d/%d.txt",rootId,fileId));

        out(response, "{\"successRecord\" : \"%d\",\"result\": \"%b\"}\n",num,b);
    }

	/**
	 * @return 削除数
	 */
	private int deleteFileFromDatabase(int fileId) {
        try {
            return executeSql("delete from file_table where id = ?").setInt(fileId).update();
        } catch (SQLException e) {
            throw new CompletionException(e);
        }
	}
}
