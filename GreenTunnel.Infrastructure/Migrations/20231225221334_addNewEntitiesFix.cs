using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenTunnel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addNewEntitiesFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Avions",
                columns: table => new
                {
                    NumAvion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomAvion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Capacite = table.Column<int>(type: "int", nullable: false),
                    Localisation = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avions", x => x.NumAvion);
                });

            migrationBuilder.CreateTable(
                name: "Pilotes",
                columns: table => new
                {
                    NumPilote = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomPilote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pilotes", x => x.NumPilote);
                });

            migrationBuilder.CreateTable(
                name: "Vols",
                columns: table => new
                {
                    NumVol = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NumPilote = table.Column<int>(type: "int", nullable: false),
                    NumAvion = table.Column<int>(type: "int", nullable: false),
                    VilleDep = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VilleArr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeureDep = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeureArr = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vols", x => x.NumVol);
                    table.ForeignKey(
                        name: "FK_Vols_Avions_NumAvion",
                        column: x => x.NumAvion,
                        principalTable: "Avions",
                        principalColumn: "NumAvion",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vols_Pilotes_NumPilote",
                        column: x => x.NumPilote,
                        principalTable: "Pilotes",
                        principalColumn: "NumPilote",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "VOL_FK1",
                table: "Vols",
                column: "NumAvion");

            migrationBuilder.CreateIndex(
                name: "VOL_FK2",
                table: "Vols",
                column: "NumPilote");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vols");

            migrationBuilder.DropTable(
                name: "Avions");

            migrationBuilder.DropTable(
                name: "Pilotes");
        }
    }
}
