USE soiled_db;
insert into users(userID,name,password,admin,createdAt,updatedAt)
values("stephend","Stephen","srds",false,"2019-09-30 09:08:46","2019-09-30 09:08:46");

insert into products(name,category,quantity,price,createdAt,updatedAt)
values("red soil","soil",5,15.00,"2019-09-30 09:08:46","2019-09-30 09:08:46"),
("pavment stones","stones",10,5.00,"2019-09-30 09:08:46","2019-09-30 09:08:46"),
("green grass","grass",15,15.00,"2019-09-30 09:08:46","2019-09-30 09:08:46");

insert into quotes(quoteID,quantity,createdAt,updatedAt,ProductId,UserId)
VALUES("Q111",2,"2019-09-30 09:08:46","2019-09-30 09:08:46",1,"1"),
("Q111",3,"2019-09-30 09:08:46","2019-09-30 09:08:46",3,"1")