# serve.py — local web server for the Pubbets Workshop builder.
# Same as Python's built-in server, but tells the browser NEVER to cache,
# so you always see your latest changes after a reload.
#
# Run manually:  py serve.py     then open http://localhost:8000/index.html

import http.server, socketserver

PORT = 8000

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # keep the console quiet

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('', PORT), NoCacheHandler) as httpd:
        print(f'Pubbets Workshop running at http://localhost:{PORT}/index.html')
        print('Keep this window open while you use the builder. Close it when done.')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
