from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
import os
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DATABASE = 'helpdesk.db'


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                priority TEXT NOT NULL,
                status TEXT DEFAULT 'Open',
                submitter_name TEXT NOT NULL,
                submitter_email TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        ''')
        conn.commit()


@app.route('/')
def index():
    conn = get_db()
    status_filter = request.args.get('status', 'All')
    priority_filter = request.args.get('priority', 'All')

    query = 'SELECT * FROM tickets WHERE 1=1'
    params = []

    if status_filter != 'All':
        query += ' AND status = ?'
        params.append(status_filter)

    if priority_filter != 'All':
        query += ' AND priority = ?'
        params.append(priority_filter)

    query += ' ORDER BY created_at DESC'
    tickets = conn.execute(query, params).fetchall()
    conn.close()

    stats = get_stats()
    return render_template('index.html', tickets=tickets, stats=stats,
                           status_filter=status_filter, priority_filter=priority_filter)


@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        conn = get_db()
        conn.execute('''
            INSERT INTO tickets (title, description, category, priority, status,
                                 submitter_name, submitter_email, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'Open', ?, ?, ?, ?)
        ''', (
            request.form['title'],
            request.form['description'],
            request.form['category'],
            request.form['priority'],
            request.form['submitter_name'],
            request.form['submitter_email'],
            now, now
        ))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    return render_template('submit.html')


@app.route('/ticket/<int:ticket_id>')
def ticket(ticket_id):
    conn = get_db()
    t = conn.execute('SELECT * FROM tickets WHERE id = ?', (ticket_id,)).fetchone()
    conn.close()
    if t is None:
        return 'Ticket not found', 404
    return render_template('ticket.html', ticket=t)


@app.route('/update/<int:ticket_id>', methods=['POST'])
def update_status(ticket_id):
    new_status = request.form['status']
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    conn = get_db()
    conn.execute('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?',
                 (new_status, now, ticket_id))
    conn.commit()
    conn.close()
    return redirect(url_for('ticket', ticket_id=ticket_id))


@app.route('/api/tickets')
def api_tickets():
    conn = get_db()
    tickets = conn.execute('SELECT * FROM tickets ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(t) for t in tickets])


def get_stats():
    conn = get_db()
    total = conn.execute('SELECT COUNT(*) FROM tickets').fetchone()[0]
    open_count = conn.execute("SELECT COUNT(*) FROM tickets WHERE status='Open'").fetchone()[0]
    in_progress = conn.execute("SELECT COUNT(*) FROM tickets WHERE status='In Progress'").fetchone()[0]
    resolved = conn.execute("SELECT COUNT(*) FROM tickets WHERE status='Resolved'").fetchone()[0]
    conn.close()
    return {'total': total, 'open': open_count, 'in_progress': in_progress, 'resolved': resolved}


init_db()
app.run(debug=True)