import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class index {

    public static void main(String[] args) throws Exception {

        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8080),
                        0
                );

        // Hello API
        server.createContext("/api/hello", exchange -> {

            String response =
                    "Hello from Java backend";

            sendResponse(exchange, response);

        });


        // Skills API
        server.createContext("/api/skills", exchange -> {

            String response =
                    "["
                    + "{\"name\":\"Python\",\"demand\":\"High\",\"level\":\"Advanced\"},"
                    + "{\"name\":\"Java\",\"demand\":\"High\",\"level\":\"Intermediate\"},"
                    + "{\"name\":\"SQL\",\"demand\":\"High\",\"level\":\"Intermediate\"},"
                    + "{\"name\":\"Data Analytics\",\"demand\":\"High\",\"level\":\"Intermediate\"}"
                    + "]";

            sendResponse(exchange, response);

        });


        // Jobs API
        server.createContext("/api/jobs", exchange -> {

            String response =
                    "["
                    + "{\"title\":\"Java Developer\",\"skills\":\"Java, SQL\"},"
                    + "{\"title\":\"Python Developer\",\"skills\":\"Python, SQL\"},"
                    + "{\"title\":\"Data Analyst\",\"skills\":\"Python, SQL, Data Analytics\"}"
                    + "]";

            sendResponse(exchange, response);

        });


        // Programs API
        server.createContext("/api/programs", exchange -> {

            String response =
                    "["
                    + "{\"name\":\"Java Full Stack Program\",\"skill\":\"Java\",\"duration\":\"6 Months\"},"
                    + "{\"name\":\"Python Programming Program\",\"skill\":\"Python\",\"duration\":\"4 Months\"},"
                    + "{\"name\":\"SQL Database Program\",\"skill\":\"SQL\",\"duration\":\"3 Months\"},"
                    + "{\"name\":\"Data Analytics Program\",\"skill\":\"Data Analytics\",\"duration\":\"5 Months\"}"
                    + "]";

            sendResponse(exchange, response);

        });


        server.start();

        System.out.println(
                "SkillBridge Java server started."
        );

        System.out.println(
                "Server running at: http://localhost:8080"
        );

    }


    // ===============================
    // SEND RESPONSE
    // ===============================

    private static void sendResponse(
            HttpExchange exchange,
            String response
    ) throws IOException {

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Origin",
                        "*"
                );

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Methods",
                        "GET, OPTIONS"
                );

        exchange.getResponseHeaders()
                .set(
                        "Content-Type",
                        "application/json; charset=UTF-8"
                );


        byte[] bytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );


        exchange.sendResponseHeaders(
                200,
                bytes.length
        );


        OutputStream output =
                exchange.getResponseBody();

        output.write(bytes);

        output.close();

    }

}
