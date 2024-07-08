create database if not exists `db_bitu_booking`;
use `db_bitu_booking`;

create table `tb_ticket` (
	`ticket_id` int not null auto_increment primary key,
    `ticket_name` varchar(255) not null,
    `ticket_price` bigint not null,
    `quantity` int not null,
    `create_at` timestamp default current_timestamp
) auto_increment = 1000;

create table `tb_user` (
	`user_id` int not null auto_increment primary key,
    `user_name` varchar(255) not null,
    `password` varchar(255) not null,
    `balance` bigint not null default 120000,
    `role` varchar(50) not null default 'user', -- user, admin
    `create_at` timestamp default current_timestamp
) auto_increment = 1000;

create table `tb_ticket_detail` (
	`td_id` int not null auto_increment primary key,
    `user_id` int not null,
    `ticket_id` int not null,
    `status` varchar(100) not null default 'booked', -- booked, confirmed, canceled
    `booking_time` timestamp default current_timestamp,
    constraint `fk_user` foreign key (`user_id`) references `tb_user`(`user_id`),
    constraint `fk_ticket` foreign key (`ticket_id`) references `tb_ticket`(`ticket_id`)
) auto_increment = 1000;

create table `tb_payment_details` (
    `td_id` int not null primary key,
    `confirmation_time` timestamp default current_timestamp,
    constraint `fk_td` foreign key (`td_id`) references `tb_ticket_detail`(`td_id`)
);

delimiter //
create trigger after_delete_tb_ticket_detail
after delete on tb_ticket_detail
for each row
begin
    update tb_ticket set quantity = quantity + 1 where ticket_id = old.ticket_id;
end //
delimiter ;

insert into `tb_user` (`user_name`, `password`) values 
('Thanh Vinh', '123456'),
('haui', '123456');

insert into `tb_ticket` (`ticket_name`, `ticket_price`, `quantity`) values 
('Ha Noi', 100000, 3),
('Budweiser', 130000, 3),
('Sai Gon', 200000, 2),
('333', 150000, 1),
('Heineken', 160000, 2),
('Tiger', 100000, 3);

select * from `tb_user`;
select * from `tb_ticket`;
select * from `tb_ticket_detail`;