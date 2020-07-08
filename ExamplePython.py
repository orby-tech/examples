
@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    return redirect(url_for("login"))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('radar'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for("radar")
        logger(current_user, "LogIn", "")
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/radar', methods=['GET', 'POST'])
def radar():
    if current_user.is_authenticated:
        logger(current_user, "ComeIn", "")
        return app.send_static_file('radar.html')
    return redirect(url_for('login'))


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logger(current_user, "LogOut", "")
    logout_user()
    return redirect(url_for('index'))


@app.route("/satellit", methods=['POST'])
def satellit():
    if current_user.is_authenticated:
        logger(current_user, "Loading page", "")
        cleanOldSeanses()
        return jsonify(satellits)
    return redirect(url_for('login'))
