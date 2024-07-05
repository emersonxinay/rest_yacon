from flask import Blueprint, render_template, request, redirect, url_for, flash
from . import db
from . import main_bp
from .models import Reservation, Order

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def home():
    return render_template('home.html')


@main_bp.route('/reserve', methods=['GET', 'POST'])
def reserve():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        date = request.form['date']
        time = request.form['time']
        people = request.form['people']
        reservation = Reservation(
            name=name, email=email, date=date, time=time, people=people)
        db.session.add(reservation)
        db.session.commit()
        flash('Reserva confirmada!')
        return redirect(url_for('home'))
    return render_template('reserve.html')


@main_bp.route('/order', methods=['GET', 'POST'])
def order():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        address = request.form['address']
        order_details = request.form['order_details']
        order = Order(name=name, email=email, address=address,
                      order_details=order_details)
        db.session.add(order)
        db.session.commit()
        flash('Pedido recibido!')
        return redirect(url_for('home'))
    return render_template('order.html')
